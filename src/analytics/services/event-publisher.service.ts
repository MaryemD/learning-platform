import { Injectable } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { SessionEvent } from '../dto/session-event.dto';
import { EventType, OptionalAlertType } from '../enums';

@Injectable()
export class EventPublisherService {
  constructor(private readonly analyticsService: AnalyticsService) {}

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

  trackQuestionResult(
    sessionId: number,
    questionId: number,
    studentId: number,
    quizId: number,
    success: boolean,
  ): void {
    const event: SessionEvent = {
      type: EventType.QuestionResult,
      timestamp: Date.now(),
      sessionId,
      questionId,
      studentId,
      success,
      quizId,
    };

    this.analyticsService.emitSessionEvent(event);
  }

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
