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

    // Validate the requested event
    if (event.pathParameters && event.pathParameters.eventId ) {
        const { eventId } = event.pathParameters;
    } else {
        log.error(errorStatus('BADQUERY', 'swimming eventId not specified'),
                  'Cannot access the requested swimming results');
        return Promise.resolve(response.error(400, {}));
    }


    return Promise.resolve(response.success(200, {}, { message: 'Successful getEventResults' }));
};