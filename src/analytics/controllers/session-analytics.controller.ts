import {
  Controller,
  Query,
  Sse,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { AnalyticsService } from '../services/analytics.service';
import { Observable } from 'rxjs';
import { Roles } from 'src/roles/roles.decorator';
import { UserRoleEnum } from 'src/enums/user-role.enum';
import { JwtAuthGuard } from 'src/users/guards/jwt-auth.guard';

@Controller('analytics')
@Roles(UserRoleEnum.INSTRUCTOR)
@UseGuards(JwtAuthGuard)
export class SessionAnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  /**
   * Stream events for a specific session
   */
  @Sse('events')
  streamEvents(
    @Query('sessionId', ParseIntPipe) sessionId: number,
  ): Observable<MessageEvent> {
    return new Observable<MessageEvent>((observer) => {
      const subscription = this.analyticsService
        .subscribeToSession(sessionId)
        .subscribe({
          next: (event) => {
            observer.next({
              data: JSON.stringify(event),
            } as MessageEvent);
          },
          error: (error) => {
            observer.error(error);
          },
        });

      return () => {
        subscription.unsubscribe();
      };
    });
  }
}
