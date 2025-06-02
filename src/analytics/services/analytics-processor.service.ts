import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { OptionalAlertType } from '../enums';

@Injectable()
export class AnalyticsProcessorService
  implements OnModuleInit, OnModuleDestroy
{
  private processingInterval: NodeJS.Timeout | null = null;

  private readonly PROCESSING_INTERVAL = 15 * 60 * 1000; // 15 minutes

  constructor(private readonly analyticsService: AnalyticsService) {}

  onModuleInit() {
    this.startPeriodicProcessing();
  }

  onModuleDestroy() {
    this.stopPeriodicProcessing();
  }

  private startPeriodicProcessing(): void {
    this.processingInterval = setInterval(() => {
      this.processAllSessions();
    }, this.PROCESSING_INTERVAL);
  }

  private stopPeriodicProcessing(): void {
    if (this.processingInterval) {
      clearInterval(this.processingInterval);
      this.processingInterval = null;
    }
  }

  private processAllSessions(): void {
    const sessionIds = this.analyticsService.getActiveSessionIds();

    for (const sessionId of sessionIds) {
      this.processSession(sessionId);
    }
  }

  private processSession(sessionId: number): void {
    const sessionData =
      this.analyticsService.getSessionDataForProcessing(sessionId);
    if (!sessionData) return;

    this.checkStudentInactivity(sessionId, sessionData);
    this.checkLowParticipation(sessionId, sessionData);
    this.checkQuestionFailureRates(sessionId, sessionData);
  }

  private checkStudentInactivity(sessionId: number, sessionData: any): void {
    const now = Date.now();
    let inactiveCount = 0;
    const inactivityThreshold = this.analyticsService.getAlertThreshold(
      sessionId,
      OptionalAlertType.STUDENT_INACTIVITY,
    );

    for (const [studentId, lastActive] of sessionData.lastActivity.entries()) {
      if (now - lastActive > inactivityThreshold) {
        inactiveCount++;
      }
    }

    if (inactiveCount > 0) {
      this.analyticsService.emitOptionalAlert(
        sessionId,
        OptionalAlertType.STUDENT_INACTIVITY,
        `${inactiveCount} students have been inactive for more than ${inactivityThreshold / (60 * 1000)} minutes`,
        { inactiveCount },
      );
    }
  }

  private checkLowParticipation(sessionId: number, sessionData: any): void {
    const totalStudents = sessionData.lastActivity.size;
    if (totalStudents === 0) return;

    // Count recently active students
    const now = Date.now();
    let activeCount = 0;
    const inactivityThreshold = this.analyticsService.getAlertThreshold(
      sessionId,
      OptionalAlertType.STUDENT_INACTIVITY,
    );

    for (const [studentId, lastActive] of sessionData.lastActivity.entries()) {
      if (now - lastActive <= inactivityThreshold) {
        activeCount++;
      }
    }

    // Calculate participation rate
    const participationRate = (activeCount / totalStudents) * 100;
    const lowParticipationThreshold = this.analyticsService.getAlertThreshold(
      sessionId,
      OptionalAlertType.LOW_PARTICIPATION,
    );

    // Emit alert if participation is below threshold
    if (participationRate < lowParticipationThreshold) {
      this.analyticsService.emitOptionalAlert(
        sessionId,
        OptionalAlertType.LOW_PARTICIPATION,
        `Participation rate (${participationRate.toFixed(1)}%) is below threshold of ${lowParticipationThreshold}%`,
        { participationRate, activeCount, totalStudents },
      );
    }
  }

  private checkQuestionFailureRates(sessionId: number, sessionData: any): void {
    const questionFailureThreshold = this.analyticsService.getAlertThreshold(
      sessionId,
      OptionalAlertType.QUESTION_FAILURE_RATE,
    );

    for (const [questionId, stats] of sessionData.questionFailures.entries()) {
      // Only check questions with enough attempts
      if (stats.attempts < 5) continue;

      // Calculate failure rate
      const failureRate = (stats.failures / stats.attempts) * 100;

      // Emit alert if failure rate is above threshold
      if (failureRate > questionFailureThreshold) {
        this.analyticsService.emitOptionalAlert(
          sessionId,
          OptionalAlertType.QUESTION_FAILURE_RATE,
          `Question ${questionId} has a high failure rate of ${failureRate.toFixed(1)}%`,
          {
            questionId,
            failureRate,
            attempts: stats.attempts,
            failures: stats.failures,
          },
        );
      }
    }
  }
}
