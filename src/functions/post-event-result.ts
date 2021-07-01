// POST a new event result
import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import { SwimmingEventType, isSwimmingEvent } from '../lib/swimming-events';
import { isLocal } from '../lib/local';
import response from '../lib/response';
import { FaasLogger, httpStatus, errorStatus } from '@greenhorn/faas-logger';
import { inspect } from 'util';

// eslint-disable-next-line no-unused-vars
import { APIGatewayEvent } from "aws-lambda";
import { resourceLimits } from 'worker_threads';

// Configure DynamoDB Client Configuration 
const ddbConfig: any = {
    region: 'us-west-2',
    logger: console,
    httpOptions: {
      connectTimeout: 100
    },
    maxAttempts: 3
};
let ddb: DynamoDBClient;

// Lookup Partial<T> partial types in typescript
interface Result {
  eventId: SwimmingEventType | null,
  eventDate: string | null,
  eventTime: string | null,
  meet: string | '';
};

export const handler = async (event: APIGatewayEvent) => {
    const log = new FaasLogger(event, 'swimming-results-api');
    log.info('Starting post-event-result');

    if (!event.body) {
        log.error(errorStatus('BADQUERY', 'missing event.body'),
                  'Cannot create new swim result');
        return Promise.resolve(response.error(400, {}));
    }
    const result = JSON.parse(event.body);
  
    // Add local endpoint if function being run locally
    if (isLocal()) {
        ddbConfig['endpoint'] = 'http://dynamodb:8000';
        ddbConfig['logger'] = log;
        log.info(`SAM_LOCAL connecting to dynamo at ${ddbConfig.endpoint}`);
    }

    const REGION = 'us-west-2';
    const USER = 'USR#mleml';
    const TABLE_NAME = 'swimming-results-db';

    result.pk = USER;
    result.sk = result.eventId + Date.now();
    const params = {
        TableName: TABLE_NAME,
        ExpressionAttributeNames: {
          "#sk": "sk"
        },
        ConditionExpression: "attribute_not_exists(#sk)",
        Item: {
          "pk": {"S": result.pk},
          "sk": {"S": result.sk},
          "eventId": {"S": result.eventId},
          "eventDate": {"S": result.eventDate},
          "eventTime": {"S": result.eventTime},
          "meet": {"S": result.meet}
        }
      };

      // Create the DynamoDB client if not previously done
      if (undefined === ddb) {
          ddb = new DynamoDBClient(ddbConfig);
      }

      try {
        const results = await ddb.send(new PutItemCommand(params));
        // results.Items!.forEach((element, index, array) => {
        //     //log.info(`element--> ${inspect(element)}`);
        //     items.push(unmarshall(element));
        //     //console.log(element);
        // });
        log.info(`results--> ${inspect(results)}`);
      } catch (err) {
        console.error(err);
      }

    //log.info(httpStatus(201), `Created: results for ${eventId}: ${JSON.stringify(items)}`);
    return Promise.resolve(response.success(201, {}, { message: `Created: ${JSON.stringify(result!)}` }));
};