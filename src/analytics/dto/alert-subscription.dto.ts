import { OptionalAlertType } from '../enums';

/**
 * DTO for subscribing to optional alerts
 */
export class AlertSubscriptionDto {
  sessionId: number;
  instructorId: string;
  alertType: OptionalAlertType;
  threshold?: number;
}

/**
 * DTO for setting alert thresholds
 */
export class AlertThresholdDto {
  sessionId: number;
  alertType: OptionalAlertType;
  threshold: number;
}

/**
 * DTO for alert data
 */
export interface AlertData {
  sessionId: number;
  timestamp: number;
  alertType: OptionalAlertType;
  message: string;
  data?: any;
}
