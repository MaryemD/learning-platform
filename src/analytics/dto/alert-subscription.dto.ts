import { OptionalAlertType } from '../enums';

/**
 * DTO for subscribing to optional alerts
 */
export class AlertSubscriptionDto {
  sessionId: string;
  instructorId: string;
  alertType: OptionalAlertType;
  threshold?: number;
}

/**
 * DTO for setting alert thresholds
 */
export class AlertThresholdDto {
  sessionId: string;
  alertType: OptionalAlertType;
  threshold: number;
}

/**
 * DTO for alert data
 */
export interface AlertData {
  sessionId: string;
  timestamp: number;
  alertType: OptionalAlertType;
  message: string;
  data?: any;
}
