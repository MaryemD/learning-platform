import { Controller, Query, Sse, UseGuards } from '@nestjs/common';
import { AnalyticsService } from '../services/analytics.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
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
    @Query('sessionId') sessionId: number,
  ): Observable<MessageEvent> {
    return this.analyticsService.subscribeToSession(sessionId).pipe(
      map(
        (event) =>
          ({
            data: event,
          }) as MessageEvent,
      ),
    );
  }
}
