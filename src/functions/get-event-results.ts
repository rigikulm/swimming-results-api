// Get the results for a particular event for the logged in swimmer
import { DynamoDBClient, GetItemCommand } from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import { SwimmingEventType, isSwimmingEvent } from '../lib/swimming-events';
import response from '../lib/response';
import { FaasLogger, httpStatus, errorStatus } from '@greenhorn/faas-logger';

// eslint-disable-next-line no-unused-vars
import { APIGatewayEvent } from "aws-lambda";

let ddb: DynamoDBClient;

export const handler = async (event: APIGatewayEvent) => {
    const log = new FaasLogger(event, 'swimming-results-api');
    log.info('Starting get-event-results');

    // Validate the eventId path parameter
    let eventId: string;
    if (event.pathParameters && event.pathParameters.eventId ) {
        eventId = event.pathParameters.eventId;
        if (!isSwimmingEvent(eventId)) {
            log.error(errorStatus('BADQUERY', 'Invalid path parameter'),
                      `${eventId} is not a valid swimming eventId`);
            return Promise.resolve(response.error(400, {}, new Error(`${eventId} is not a valid swimming eventId`)));
        }
    } else {
        // @TODO is this check required or does APIGW always make certain the
        // path parameter is provided
        log.error(errorStatus('BADQUERY', 'swimming eventId not specified'),
                  'Cannot access the requested swimming results');
        return Promise.resolve(response.error(400, {}));
    }

    log.info(httpStatus(200), `Success! Returned results for ${eventId}`);
    return Promise.resolve(response.success(200, {}, { message: `Success! Returned results for ${eventId}` }));
};