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
      quizId,
      studentId,
      success,
      questionId,
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
