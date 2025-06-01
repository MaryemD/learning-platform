import { Injectable } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { SessionEvent } from '../dto/session-event.dto';
import { EventType, OptionalAlertType } from '../enums';

/**
 * Service for publishing standardized analytics events
 */
@Injectable()
export class EventPublisherService {
  constructor(private readonly analyticsService: AnalyticsService) {}

  /**
   * Notifies when a student joins a session
   */
  notifyStudentJoined(
    sessionId: number,
    studentId: number,
    studentName: string,
  ): void {
    const event: SessionEvent = {
      type: EventType.StudentJoined,
      timestamp: Date.now(),
      sessionId,
      studentId,
      studentName,
    };

    this.analyticsService.emitSessionEvent(event);
  }

  /**
   * Notifies when a student participates in a quiz
   */
  notifyQuizParticipation(
    sessionId: number,
    studentId: number,
    quizId?: number,
  ): void {
    const event: SessionEvent = {
      type: EventType.QuizParticipation,
      timestamp: Date.now(),
      sessionId,
      studentId,
      quizId,
    };

    this.analyticsService.emitSessionEvent(event);
  }

  /**
   * Track a quiz's question result (success or failure)
   */
  NotifyWithQuizQuestionResult(
    sessionId: number,
    quizId: number,
    questionId: number,
    studentId: number,
    success: boolean,
  ): void {
    const event: SessionEvent = {
      type: EventType.QuestionResult,
      timestamp: Date.now(),
      sessionId,
      quizId,
      studentId,
      success,
      questionId,
    };

    this.analyticsService.emitSessionEvent(event);
  }

  /**
   * Emit an optional alert
   */
  emitOptionalAlert(
    sessionId: number,
    alertType: OptionalAlertType,
    message: string,
    data?: any,
  ): void {
    this.analyticsService.emitOptionalAlert(
      sessionId,
      alertType,
      message,
      data,
    );
  }
}
