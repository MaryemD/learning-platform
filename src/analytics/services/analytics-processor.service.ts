import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { OptionalAlertType } from '../enums';

@Injectable()
export class AnalyticsProcessorService implements OnModuleInit, OnModuleDestroy {
  private processingInterval: NodeJS.Timeout | null = null;
  
  // Configuration
  private readonly PROCESSING_INTERVAL = 5 * 60 * 1000; // 5 minutes
  
  constructor(private readonly analyticsService: AnalyticsService) {}
  
  onModuleInit() {
    this.startPeriodicProcessing();
  }
  
  onModuleDestroy() {
    this.stopPeriodicProcessing();
  }
  
  /**
   * Start periodic processing of session data
   */
  private startPeriodicProcessing(): void {
    this.processingInterval = setInterval(() => {
      this.processAllSessions();
    }, this.PROCESSING_INTERVAL);
  }
  
  /**
   * Stop periodic processing
   */
  private stopPeriodicProcessing(): void {
    if (this.processingInterval) {
      clearInterval(this.processingInterval);
      this.processingInterval = null;
    }
  }
  
  /**
   * Process all active sessions
   */
  private processAllSessions(): void {
    const sessionIds = this.analyticsService.getActiveSessionIds();
    
    for (const sessionId of sessionIds) {
      this.processSession(sessionId);
    }
  }
  
  /**
   * Process a single session
   */
  private processSession(sessionId: string): void {
    const sessionData = this.analyticsService.getSessionDataForProcessing(sessionId);
    if (!sessionData) return;
    
    // Check for student inactivity
    this.checkStudentInactivity(sessionId, sessionData);
    
    // Check for low participation
    this.checkLowParticipation(sessionId, sessionData);
    
    // Check for question failure rates
    this.checkQuestionFailureRates(sessionId, sessionData);
  }
  
  /**
   * Check for student inactivity
   */
  private checkStudentInactivity(sessionId: string, sessionData: any): void {
    const now = Date.now();
    let inactiveCount = 0;
    const inactivityThreshold = this.analyticsService.getAlertThreshold(
      sessionId, 
      OptionalAlertType.STUDENT_INACTIVITY
    );
    
    // Count inactive students
    for (const [studentId, lastActive] of sessionData.lastActivity.entries()) {
      if (now - lastActive > inactivityThreshold) {
        inactiveCount++;
      }
    }
    
    // Only emit alert if there are inactive students
    if (inactiveCount > 0) {
      this.analyticsService.emitOptionalAlert(
        sessionId,
        OptionalAlertType.STUDENT_INACTIVITY,
        `${inactiveCount} students have been inactive for more than ${inactivityThreshold / (60 * 1000)} minutes`,
        { inactiveCount }
      );
    }
  }
  
  /**
   * Check for low participation
   */
  private checkLowParticipation(sessionId: string, sessionData: any): void {
    const totalStudents = sessionData.lastActivity.size;
    if (totalStudents === 0) return;
    
    // Count recently active students (within inactivity threshold)
    const now = Date.now();
    let activeCount = 0;
    const inactivityThreshold = this.analyticsService.getAlertThreshold(
      sessionId, 
      OptionalAlertType.STUDENT_INACTIVITY
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
      OptionalAlertType.LOW_PARTICIPATION
    );
    
    // Emit alert if participation is below threshold
    if (participationRate < lowParticipationThreshold) {
      this.analyticsService.emitOptionalAlert(
        sessionId,
        OptionalAlertType.LOW_PARTICIPATION,
        `Participation rate (${participationRate.toFixed(1)}%) is below threshold of ${lowParticipationThreshold}%`,
        { participationRate, activeCount, totalStudents }
      );
    }
  }
  
  /**
   * Check for high question failure rates
   */
  private checkQuestionFailureRates(sessionId: string, sessionData: any): void {
    const questionFailureThreshold = this.analyticsService.getAlertThreshold(
      sessionId, 
      OptionalAlertType.QUESTION_FAILURE_RATE
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
          { questionId, failureRate, attempts: stats.attempts, failures: stats.failures }
        );
      }
    }
  }
  
  /**
   * Manually trigger processing (for testing)
   */
  triggerProcessing(): void {
    this.processAllSessions();
  }
}
