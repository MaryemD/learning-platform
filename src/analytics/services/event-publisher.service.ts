import { Injectable } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { SessionEvent } from '../dto/session-event.dto';
import { EventType } from '../enums';

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
    sessionId: string,
    studentId: string,
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
    sessionId: string,
    studentId: string,
    completed: boolean = false,
    quizId?: string,
  ): void {
    const event: SessionEvent = {
      type: EventType.QuizParticipation,
      timestamp: Date.now(),
      sessionId,
      studentId,
      quizId,
      completed,
    };

    this.analyticsService.emitSessionEvent(event);
  }

  /**
   * Notifies when a new question is asked
   */
  notifyNewQuestion(
    sessionId: string,
    questionId: string,
    question: string,
    studentId: string,
  ): void {
    const event: SessionEvent = {
      type: EventType.NewQuestion,
      timestamp: Date.now(),
      sessionId,
      questionId,
      question,
      studentId,
    };

    this.analyticsService.emitSessionEvent(event);
  }
}
