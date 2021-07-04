// Models a SwimmingResult and provides validation helper
import { SwimmingEventType, isSwimmingEvent } from '../lib/swimming-events';

/**
 * Models the results for a single swim result
 * @interface SwimResult - Models the results for a single swim result
 * @member SwimmingEventType eventId - the swimming event (e.g. FREE200SCYD)
 */
export interface SwimResult {
  eventId: SwimmingEventType,
  eventDate: string,
  eventTime: string,
  meet: string | '',
  pk?: string,
  sk?: string
};