// Models a SwimmingResult and provides validation helper
import { SwimmingEventType, isSwimmingEvent } from '../lib/swimming-events';
import Joi, { ValidationError } from 'joi';

/**
 * Models the results for a single swim result
 * @interface SwimResult - Models the results for a single swim result
 * @member SwimmingEventType eventId - the swimming event (e.g. FREE200SCYD)
 */
export type SwimResult = {
  eventId: SwimmingEventType,
  eventDate: string,
  eventTime: number,
  meet?: string,
  pk?: string,
  sk?: string
} | null;

const resultSchema = Joi.object({
  eventId: Joi.string()
              .required()
              .custom((value, helpers) => {
                if (isSwimmingEvent(value)) {
                  return value;
                } else {
                  return helpers.error('any.invalid');
                }
              }),
  eventDate: Joi.string()
                .isoDate()
                .required(),
  meet: Joi.string()
            .max(80),
  eventTime: Joi.number()
                .min(0)
                .max(36000000)
                .required()
});

/**
 * Constructs a swim result object from the event.body which is passed via `input`
 * 
 * @param input the AWS Lambda event.body parameter
 * @returns a SwimResult (result), or error if there are invalid values in the body
 */
export function createSwimResult(input: any): {result: SwimResult, error: any} {
  let result = null;
  let {error, value} = resultSchema.validate(JSON.parse(input));
  if (!error) {
    result = <SwimResult>value;
  }
  return {result, error};
}

