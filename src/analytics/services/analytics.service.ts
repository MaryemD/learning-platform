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
  private sessionEvents = new Map<string, Subject<SessionEvent>>();
  private sessionAlerts = new Map<string, Subject<AlertData>>();
  private sessionData = new Map<string, SessionData>();

  // Default alert thresholds
  private readonly DEFAULT_INACTIVITY_THRESHOLD = 10 * 60 * 1000; // 10 minutes
  private readonly DEFAULT_LOW_PARTICIPATION_THRESHOLD = 30; // 30% participation
  private readonly DEFAULT_QUESTION_FAILURE_THRESHOLD = 70; // 70% failure rate
  private readonly ALERT_COOLDOWN = 5 * 60 * 1000; // 5 minutes between same alert type

  /**
   * Initialize a session
   */
  initSession(sessionId: string): void {
    if (!this.sessionEvents.has(sessionId)) {
      this.sessionEvents.set(sessionId, new Subject<SessionEvent>());
    }

    if (!this.sessionAlerts.has(sessionId)) {
      this.sessionAlerts.set(sessionId, new Subject<AlertData>());
    }

    if (!this.sessionData.has(sessionId)) {
      // Initialize default thresholds
      const alertThresholds = new Map<OptionalAlertType, AlertThreshold>();
      alertThresholds.set(OptionalAlertType.STUDENT_INACTIVITY, { 
        threshold: this.DEFAULT_INACTIVITY_THRESHOLD 
      });
      alertThresholds.set(OptionalAlertType.LOW_PARTICIPATION, { 
        threshold: this.DEFAULT_LOW_PARTICIPATION_THRESHOLD 
      });
      alertThresholds.set(OptionalAlertType.QUESTION_FAILURE_RATE, { 
        threshold: this.DEFAULT_QUESTION_FAILURE_THRESHOLD 
      });

      this.sessionData.set(sessionId, {
        lastActivity: new Map<string, number>(),
        alertSubscriptions: new Set<OptionalAlertType>(),
        alertThresholds,
        questionFailures: new Map<string, { attempts: number; failures: number }>(),
        lastAlertTimestamps: new Map<OptionalAlertType, number>(),
      });
    }
  }

  /**
   * Subscribe to session events
   */
  subscribeToSession(sessionId: string): Observable<SessionEvent> {
    this.initSession(sessionId);
    return this.sessionEvents.get(sessionId)!.asObservable();
  }

  /**
   * Subscribe to session alerts
   */
  subscribeToSessionAlerts(sessionId: string): Observable<AlertData> {
    this.initSession(sessionId);
    return this.sessionAlerts.get(sessionId)!.asObservable();
  }

  /**
   * Subscribe to a specific alert type for a session
   */
  subscribeToAlert(
    sessionId: string,
    instructorId: string,
    alertType: OptionalAlertType,
    threshold?: number,
  ): void {
    this.initSession(sessionId);
    const sessionData = this.sessionData.get(sessionId)!;
    
    // Add to subscriptions
    sessionData.alertSubscriptions.add(alertType);
    
    // Update threshold if provided
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
    sessionId: string,
    instructorId: string,
    alertType: OptionalAlertType,
  ): void {
    this.initSession(sessionId);
    const sessionData = this.sessionData.get(sessionId)!;
    
    // Remove from subscriptions
    sessionData.alertSubscriptions.delete(alertType);
  }

  /**
   * Check if the session is subscribed to a specific alert type
   */
  hasAlertSubscription(
    sessionId: string,
    alertType: OptionalAlertType,
  ): boolean {
    const sessionData = this.sessionData.get(sessionId);
    if (!sessionData) return false;
    
    return sessionData.alertSubscriptions.has(alertType);
  }

  /**
   * Get the threshold for a specific alert type
   */
  getAlertThreshold(
    sessionId: string,
    alertType: OptionalAlertType,
  ): number {
    const sessionData = this.sessionData.get(sessionId);
    if (!sessionData) {
      // Return default threshold if session doesn't exist
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

  /**
   * Set the threshold for a specific alert type
   */
  setAlertThreshold(
    sessionId: string,
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

  /**
   * Emit a session event
   */
  emitSessionEvent(event: SessionEvent): void {
    const { sessionId, studentId } = event;
    this.initSession(sessionId);

    const sessionData = this.sessionData.get(sessionId)!;
    
    // Update last activity timestamp for the student
    sessionData.lastActivity.set(studentId, Date.now());

    // Track question failures if this is a question result event
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

  /**
   * Track a question result for failure rate calculation
   */
  private trackQuestionResult(
    sessionId: string,
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

  /**
   * Emit an optional alert if there are subscribers
   */
  emitOptionalAlert(
    sessionId: string,
    alertType: OptionalAlertType,
    message: string,
    data?: any,
  ): void {
    this.initSession(sessionId);

    // Check if the session is subscribed to this alert type
    if (!this.hasAlertSubscription(sessionId, alertType)) {
      return;
    }

    // Check cooldown to prevent alert spam
    const sessionData = this.sessionData.get(sessionId)!;
    const now = Date.now();
    const lastAlertTime = sessionData.lastAlertTimestamps.get(alertType) || 0;

    if (now - lastAlertTime < this.ALERT_COOLDOWN) {
      return;
    }

    // Update last alert timestamp
    sessionData.lastAlertTimestamps.set(alertType, now);

    // Create alert data
    const alertData: AlertData = {
      sessionId,
      timestamp: now,
      alertType,
      message,
      data,
    };

    // Emit the alert
    const alertSubject = this.sessionAlerts.get(sessionId);
    if (alertSubject) {
      alertSubject.next(alertData);
    }
  }

  /**
   * Clean up session resources
   */
  cleanupSession(sessionId: string): void {
    this.sessionEvents.delete(sessionId);
    this.sessionAlerts.delete(sessionId);
    this.sessionData.delete(sessionId);
  }

  /**
   * Get all active session IDs
   */
  getActiveSessionIds(): string[] {
    return Array.from(this.sessionData.keys());
  }

  /**
   * Get session data for analytics processing
   */
  getSessionDataForProcessing(sessionId: string): SessionData | undefined {
    return this.sessionData.get(sessionId);
  }
}
