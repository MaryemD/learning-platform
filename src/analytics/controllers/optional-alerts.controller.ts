import {
  Controller,
  Post,
  Body,
  Delete,
  Param,
  Sse,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { AnalyticsService } from '../services/analytics.service';
import { OptionalAlertType } from '../enums';
import { Observable } from 'rxjs';
import { UserRoleEnum } from 'src/enums/user-role.enum';
import { Roles } from 'src/roles/roles.decorator';
import { JwtAuthGuard } from 'src/users/guards/jwt-auth.guard';

interface AlertSubscriptionRequest {
  sessionId: number;
  instructorId: number;
  alertType: OptionalAlertType;
  threshold?: number;
}

interface AlertThresholdRequest {
  sessionId: number;
  alertType: OptionalAlertType;
  threshold: number;
}

@Controller('analytics/alerts')
@Roles(UserRoleEnum.INSTRUCTOR)
@UseGuards(JwtAuthGuard)
export class OptionalAlertsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  /**
   * Subscribe to an optional alert for a session
   */
  @Post('subscribe')
  subscribeToAlert(@Body() request: AlertSubscriptionRequest) {
    this.analyticsService.subscribeToAlert(
      request.sessionId,
      request.instructorId,
      request.alertType,
      request.threshold,
    );

    return {
      success: true,
      message: `Subscribed to ${request.alertType} alerts for session ${request.sessionId}`,
    };
  }

  /**
   * Unsubscribe from an optional alert for a session
   */
  @Delete('unsubscribe/:sessionId/:instructorId/:alertType')
  unsubscribeFromAlert(
    @Param('sessionId') sessionId: number,
    @Param('instructorId') instructorId: number,

    @Param('alertType') alertType: OptionalAlertType,
  ) {
    this.analyticsService.unsubscribeFromAlert(
      sessionId,
      instructorId,
      alertType,
    );

    return {
      success: true,
      message: `Unsubscribed from ${alertType} alerts for session ${sessionId}`,
    };
  }

  /**
   * Set threshold for an alert type
   */
  @Post('threshold')
  setAlertThreshold(@Body() request: AlertThresholdRequest) {
    this.analyticsService.setAlertThreshold(
      request.sessionId,
      request.alertType,
      request.threshold,
    );

    return {
      success: true,
      message: `Set threshold for ${request.alertType} to ${request.threshold} for session ${request.sessionId}`,
    };
  }

  /**
   * Stream optional alerts for a session
   */
  @Sse('stream')
  streamAlerts(
    @Query('sessionId', ParseIntPipe) sessionId: number,
  ): Observable<MessageEvent> {
    return new Observable<MessageEvent>((observer) => {
      const subscription = this.analyticsService
        .subscribeToSessionAlerts(sessionId)
        .subscribe({
          next: (alert) => {
            observer.next({
              data: JSON.stringify(alert),
            } as MessageEvent);
          },
          error: (error) => {
            observer.error(error);
          },
        });

      return () => {
        if ((observer as any).subscription) {
          (observer as any).subscription.unsubscribe();
        }
      };
    });
  }
}
