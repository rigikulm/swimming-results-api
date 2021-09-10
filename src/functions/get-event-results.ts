// Get the results for a particular event for the logged in swimmer
import { ddbClient } from '../lib/dynamo-client';
import { DynamoDBClient, QueryCommand } from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import { SwimmingEventType, isSwimmingEvent } from '../lib/swimming-events';
import { isLocal } from '../lib/local';
import response from '../lib/response';
import { FaasLogger, httpStatus, errorStatus } from '@greenhorn/faas-logger';
import { inspect } from 'util';

// eslint-disable-next-line no-unused-vars
import { APIGatewayEvent } from "aws-lambda";

export const handler = async (event: APIGatewayEvent) => {
    let ddb: DynamoDBClient;
    const log = new FaasLogger(event, 'swimming-results-api');
    //log.info('Starting get-event-results');

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

    const REGION = 'us-west-2';
    const USER = 'USR#mleml';
    const TABLE_NAME = 'swimming-results-db';

    const params = {
        TableName: TABLE_NAME,
        // Convert the JavaScript object defining the objects to the required DynamoDB format.The format of values
        // specifies the datatype. The following list demonstrates different datatype formatting requirements:
        // HashKey: "hashKey",
        // NumAttribute: 1,
        // BoolAttribute: true,
        // ListAttribute: [1, "two", false],
        // MapAttribute: { foo: "bar" },
        // NullAttribute: null
        ExpressionAttributeValues: marshall({
          ":s": USER,
          ":e": eventId
        }),
        // Specifies the values that define the range of the retrieved items. In this case, items in Season 2 before episode 9.
        KeyConditionExpression: "pk = :s and begins_with(sk, :e)"
      };

      // Create the DynamoDB client if not previously done
      ddb = ddbClient(REGION);

      let items: any = [];
      try {
        const results = await ddb.send(new QueryCommand(params));
        results.Items!.forEach((element, index, array) => {
            //log.info(`element--> ${inspect(element)}`);
            items.push(unmarshall(element));
            //console.log(element);
        });
        log.info(`results--> ${inspect(items)}`);
      } catch (err) {
        console.error(err);
      }

    log.info(httpStatus(200), `Success! Results for ${eventId}: ${JSON.stringify(items)}`);
    return Promise.resolve(response.success(200, {}, { message: `Success! Results for ${eventId}: ${JSON.stringify(items)}` }));
};