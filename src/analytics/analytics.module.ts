import { Module } from '@nestjs/common';
import { SessionAnalyticsController } from './controllers/session-analytics.controller';
import { OptionalAlertsController } from './controllers/optional-alerts.controller';
import { AnalyticsTestController } from './controllers/analytics-test.controller';
import { AnalyticsService } from './services/analytics.service';
import { EventPublisherService } from './services/event-publisher.service';
import { AnalyticsProcessorService } from './services/analytics-processor.service';

@Module({
  controllers: [
    SessionAnalyticsController,
    OptionalAlertsController,
    AnalyticsTestController,
  ],
  providers: [
    AnalyticsService,
    EventPublisherService,
    AnalyticsProcessorService,
  ],
  exports: [AnalyticsService, EventPublisherService],
})
export class AnalyticsModule {}
