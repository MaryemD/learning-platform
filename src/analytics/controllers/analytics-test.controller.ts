import {
  Controller,
  Post,
  Param,
  ParseIntPipe,
  Body,
  Sse,
  Query,
} from '@nestjs/common';
import { EventPublisherService } from '../services/event-publisher.service';
import { AnalyticsService } from '../services/analytics.service';
import { OptionalAlertType } from '../enums';
import { Observable } from 'rxjs';

@Controller('analytics/test')
export class AnalyticsTestController {
  constructor(
    private readonly eventPublisherService: EventPublisherService,
    private readonly analyticsService: AnalyticsService,
  ) {}

  /**
   * Trigger a student joined event
   */
  @Post('student-joined/:sessionId')
  triggerStudentJoined(@Param('sessionId', ParseIntPipe) sessionId: number) {
    this.eventPublisherService.notifyStudentJoined(
      sessionId,
      3,
      'Alice Cooper',
    );

    return {
      success: true,
      message: `Student joined event triggered for session ${sessionId}`,
      data: {
        sessionId,
        studentId: 3,
        studentName: 'Alice Cooper',
      },
    };
  }

  /**
   * Trigger a quiz participation event
   */
  @Post('quiz-participation/:sessionId')
  triggerQuizParticipation(
    @Param('sessionId', ParseIntPipe) sessionId: number,
  ) {
    this.eventPublisherService.notifyQuizParticipation(sessionId, 3, 1);

    return {
      success: true,
      message: `Quiz participation event triggered for session ${sessionId}`,
      data: {
        sessionId,
        studentId: 3,
        quizId: 1,
      },
    };
  }

  /**
   * Trigger a correct question result event
   */
  @Post('question-correct/:sessionId')
  triggerQuestionCorrect(@Param('sessionId', ParseIntPipe) sessionId: number) {
    this.eventPublisherService.trackQuestionResult(
      sessionId,
      1, // Hardcoded question ID
      3, // Hardcoded student ID
      1, // Hardcoded quiz ID
      true, // Correct answer
    );

    return {
      success: true,
      message: `Correct question result event triggered for session ${sessionId}`,
      data: {
        sessionId,
        questionId: 1,
        studentId: 3,
        quizId: 1,
        success: true,
      },
    };
  }

  /**
   * Trigger an incorrect question result event
   */
  @Post('question-incorrect/:sessionId')
  triggerQuestionIncorrect(
    @Param('sessionId', ParseIntPipe) sessionId: number,
  ) {
    this.eventPublisherService.trackQuestionResult(
      sessionId,
      1, // Hardcoded question ID
      3, // Hardcoded student ID
      1, // Hardcoded quiz ID
      false, // Incorrect answer
    );

    return {
      success: true,
      message: `Incorrect question result event triggered for session ${sessionId}`,
      data: {
        sessionId,
        questionId: 1,
        studentId: 3,
        quizId: 1,
        success: false,
      },
    };
  }

  /**
   * Trigger multiple incorrect answers to test failure rate alerts
   * Should pass only if the threshold is set to 50% or less
   */
  @Post('trigger-failure-alert/:sessionId')
  triggerFailureAlert(@Param('sessionId', ParseIntPipe) sessionId: number) {
    for (let i = 1; i <= 6; i++) {
      this.eventPublisherService.trackQuestionResult(
        sessionId,
        1, // Same question ID (question 1)
        3, // Same student ID
        1, // Same quiz ID
        i % 2 === 0,
      );
    }

    return {
      success: true,
      data: {
        sessionId,
        questionId: 1,
        incorrectAnswers: 6,
        studentId: 3,
        quizId: 1,
      },
    };
  }
}
