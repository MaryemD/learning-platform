import { Injectable } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { SessionEvent } from '../dto/session-event.dto';
import { EventType, OptionalAlertType } from '../enums';

@Injectable()
export class EventPublisherService {
  constructor(private readonly analyticsService: AnalyticsService) {}

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

  trackQuestionResult(
    sessionId: string,
    questionId: string,
    studentId: string,
    success: boolean,
  ): void {
    const event: SessionEvent = {
      type: EventType.QuestionResult,
      timestamp: Date.now(),
      sessionId,
      questionId,
      studentId,
      success,
    };

    this.analyticsService.emitSessionEvent(event);
  }

  emitOptionalAlert(
    sessionId: string,
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
