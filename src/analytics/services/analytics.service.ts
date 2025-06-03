import { Injectable } from '@nestjs/common';
import { Subject, Observable } from 'rxjs';
import { SessionEvent } from '../dto/session-event.dto';
import { EventType, OptionalAlertType } from '../enums';
import { AlertData } from '../dto/alert-subscription.dto';

interface AlertThreshold {
  threshold: number;
}

interface SessionData {
  lastActivity: Map<string, number>; // studentId -> timestamp
  alertSubscriptions: Set<OptionalAlertType>; // Subscribed alert types
  alertThresholds: Map<OptionalAlertType, AlertThreshold>; // Alert type -> threshold
  questionFailures: Map<string, { attempts: number; failures: number }>; // questionId -> stats
  lastAlertTimestamps: Map<OptionalAlertType, number>; // To prevent alert spam
}

/**
 * Core analytics service that manages session event streams and optional alerts
 */
@Injectable()
export class AnalyticsService {
  private sessionEvents = new Map<number, Subject<SessionEvent>>();
  private sessionAlerts = new Map<number, Subject<AlertData>>();
  private sessionData = new Map<number, SessionData>();

  private readonly DEFAULT_INACTIVITY_THRESHOLD = 10 * 60 * 1000; // 10 minutes
  private readonly DEFAULT_LOW_PARTICIPATION_THRESHOLD = 30; // 30% participation
  private readonly DEFAULT_QUESTION_FAILURE_THRESHOLD = 70; // 70% failure rate
  private readonly ALERT_COOLDOWN = 5 * 60 * 1000; // 5 minutes between same alert type


  initSession(sessionId: string): void {
    if (!this.sessionEvents.has(sessionId)) {
      this.sessionEvents.set(sessionId, new Subject<SessionEvent>());
    }

    if (!this.sessionAlerts.has(sessionId)) {
      this.sessionAlerts.set(sessionId, new Subject<AlertData>());
    }

    if (!this.sessionData.has(sessionId)) {
      const alertThresholds = new Map<OptionalAlertType, AlertThreshold>();
      alertThresholds.set(OptionalAlertType.STUDENT_INACTIVITY, {
        threshold: this.DEFAULT_INACTIVITY_THRESHOLD,
      });
      alertThresholds.set(OptionalAlertType.LOW_PARTICIPATION, {
        threshold: this.DEFAULT_LOW_PARTICIPATION_THRESHOLD,
      });
      alertThresholds.set(OptionalAlertType.QUESTION_FAILURE_RATE, {
        threshold: this.DEFAULT_QUESTION_FAILURE_THRESHOLD,
      });

      this.sessionData.set(sessionId, {
        lastActivity: new Map<string, number>(),
        alertSubscriptions: new Set<OptionalAlertType>(),
        alertThresholds,
        questionFailures: new Map<
          string,
          { attempts: number; failures: number }
        >(),
        lastAlertTimestamps: new Map<OptionalAlertType, number>(),
      });
    }
  }


  subscribeToSession(sessionId: string): Observable<SessionEvent> {
    this.initSession(sessionId);
    return this.sessionEvents.get(sessionId)!.asObservable();
  }


  subscribeToSessionAlerts(sessionId: string): Observable<AlertData> {
    this.initSession(sessionId);
    return this.sessionAlerts.get(sessionId)!.asObservable();
  }

  /**
   * Subscribe to a specific alert type for a session
   */
  subscribeToAlert(
    sessionId: number,
    instructorId: number,
    alertType: OptionalAlertType,
    threshold?: number,
  ): void {
    this.initSession(sessionId);
    const sessionData = this.sessionData.get(sessionId)!;

    sessionData.alertSubscriptions.add(alertType);

    if (threshold !== undefined) {
      const alertThreshold = sessionData.alertThresholds.get(alertType);
      if (alertThreshold) {
        alertThreshold.threshold = threshold;
      }
    }
  }

  /**
   * Unsubscribe from a specific alert type for a session
   */
  unsubscribeFromAlert(
    sessionId: number,
    instructorId: number,
    alertType: OptionalAlertType,
  ): void {
    this.initSession(sessionId);
    const sessionData = this.sessionData.get(sessionId)!;


    sessionData.alertSubscriptions.delete(alertType);
  }

  hasAlertSubscription(
    sessionId: number,
    alertType: OptionalAlertType,
  ): boolean {
    const sessionData = this.sessionData.get(sessionId);
    if (!sessionData) return false;

    return sessionData.alertSubscriptions.has(alertType);
  }


  getAlertThreshold(sessionId: string, alertType: OptionalAlertType): number {
    const sessionData = this.sessionData.get(sessionId);
    if (!sessionData) {
      switch (alertType) {
        case OptionalAlertType.STUDENT_INACTIVITY:
          return this.DEFAULT_INACTIVITY_THRESHOLD;
        case OptionalAlertType.LOW_PARTICIPATION:
          return this.DEFAULT_LOW_PARTICIPATION_THRESHOLD;
        case OptionalAlertType.QUESTION_FAILURE_RATE:
          return this.DEFAULT_QUESTION_FAILURE_THRESHOLD;
        default:
          return 0;
      }
    }

    const threshold = sessionData.alertThresholds.get(alertType);
    return threshold ? threshold.threshold : 0;
  }

  setAlertThreshold(
    sessionId: number,
    alertType: OptionalAlertType,
    threshold: number,
  ): void {
    this.initSession(sessionId);
    const sessionData = this.sessionData.get(sessionId)!;

    const alertThreshold = sessionData.alertThresholds.get(alertType);
    if (alertThreshold) {
      alertThreshold.threshold = threshold;
    }
  }

  emitSessionEvent(event: SessionEvent): void {
    const { sessionId, studentId } = event;
    this.initSession(sessionId);

    const sessionData = this.sessionData.get(sessionId)!;


    sessionData.lastActivity.set(studentId, Date.now());

    if (
      event.type === EventType.QuestionResult &&
      'questionId' in event &&
      'success' in event
    ) {
      this.trackQuestionResult(sessionId, event.questionId, event.success);
    }

    const subject = this.sessionEvents.get(sessionId);
    if (subject) {
      subject.next(event);
    }
  }

  private trackQuestionResult(
    sessionId: number,
    questionId: string,
    success: boolean,
  ): void {
    const sessionData = this.sessionData.get(sessionId);
    if (!sessionData) return;

    if (!sessionData.questionFailures.has(questionId)) {
      sessionData.questionFailures.set(questionId, {
        attempts: 0,
        failures: 0,
      });
    }

    const stats = sessionData.questionFailures.get(questionId)!;
    stats.attempts++;
    if (!success) {
      stats.failures++;
    }
  }

  emitOptionalAlert(
    sessionId: number,
    alertType: OptionalAlertType,
    message: string,
    data?: any,
  ): void {
    this.initSession(sessionId);

    if (!this.hasAlertSubscription(sessionId, alertType)) {
      return;
    }

    const sessionData = this.sessionData.get(sessionId)!;
    const now = Date.now();
    const lastAlertTime = sessionData.lastAlertTimestamps.get(alertType) || 0;

    if (now - lastAlertTime < this.ALERT_COOLDOWN) {
      return;
    }

    sessionData.lastAlertTimestamps.set(alertType, now);

    const alertData: AlertData = {
      sessionId,
      timestamp: now,
      alertType,
      message,
      data,
    };

    const alertSubject = this.sessionAlerts.get(sessionId);
    if (alertSubject) {
      alertSubject.next(alertData);
    }
  }


  cleanupSession(sessionId: string): void {
    this.sessionEvents.delete(sessionId);
    this.sessionAlerts.delete(sessionId);
    this.sessionData.delete(sessionId);
  }


  getActiveSessionIds(): string[] {
    return Array.from(this.sessionData.keys());
  }

  getSessionDataForProcessing(sessionId: string): SessionData | undefined {
>>>>>>> main
    return this.sessionData.get(sessionId);
  }
}
