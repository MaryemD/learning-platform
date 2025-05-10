import { Module } from '@nestjs/common';
import { SessionAnalyticsController } from './controllers/session-analytics.controller';
import { AnalyticsService } from './services/analytics.service';
import { EventPublisherService } from './services/event-publisher.service';

@Module({
  controllers: [SessionAnalyticsController],
  providers: [AnalyticsService, EventPublisherService],
  exports: [EventPublisherService],
})
export class AnalyticsModule {}
