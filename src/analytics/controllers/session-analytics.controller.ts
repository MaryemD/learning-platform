import { Controller, Query, Sse } from '@nestjs/common';
import { AnalyticsService } from '../services/analytics.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// To be added later after auth is implemented
// import { AuthGuard } from '../../auth/guards/auth.guard';
// import { RolesGuard } from '../../roles/roles.guard';
// import { Roles } from '../../roles/roles.decorator';

@Controller('analytics')
// @UseGuards(AuthGuard, RolesGuard)
// @Roles('Instructor')
export class SessionAnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  /**
   * Stream events for a specific session
   */
  @Sse('events')
  streamEvents(
    @Query('sessionId') sessionId: string,
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
