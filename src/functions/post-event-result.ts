// POST a new event result
import { ddbClient } from "../lib/dynamo-client";
import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";
import { SwimmingEventType, isSwimmingEvent } from "../lib/swimming-events";
import response from "../lib/response";
import { FaasLogger, httpStatus, errorStatus } from "@greenhorn/faas-logger";
import { inspect } from "util";

// eslint-disable-next-line no-unused-vars
import { APIGatewayEvent } from "aws-lambda";

// Lookup Partial<T> partial types in typescript
interface SwimResult {
  eventId: SwimmingEventType;
  eventDate: string;
  eventTime: string;
  meet: string | "";
  pk?: string;
  sk?: string;
}

/**
 * @function handler - Put the specified swimming result into the databsse
 *
 * @param event - request 'event' that contains {@link models/swimming-result | SwimmingResult} details
 * @returns success or error {@link lib/response | body response}
 */
export const handler = async (event: APIGatewayEvent) => {
  let ddb: DynamoDBClient;
  const log = new FaasLogger(event, "swimming-results-api");
  log.info("Starting post-event-result");

  if (!event.body) {
    log.error(
      errorStatus("BADQUERY", "missing event.body"),
      "Cannot create new swim result"
    );
    return Promise.resolve(response.error(400, {}));
  }
  const result: SwimResult = JSON.parse(event.body);

  const REGION = "us-west-2";
  const USER = "USR#mleml";
  const TABLE_NAME = "swimming-results-db";

  result.pk = USER;
  result.sk = `${result.eventId}#${Date.now()}`;
  const params = {
    TableName: TABLE_NAME,
    Item: marshall(result),
  };

  ddb = ddbClient(REGION);
  try {
    const rc = await ddb.send(new PutItemCommand(params));
    log.info(`DDB PutItemCommand response: ${JSON.stringify(rc)}`);
  } catch (err) {
    log.error(
      httpStatus(500),
      `Error: Could not create swim result. ${inspect(err)}`
    );
    return Promise.resolve(response.error(500, {}, err));
  }

  log.info(httpStatus(201), `Created: result: ${JSON.stringify(result)}`);
  return Promise.resolve(
    response.success(
      201,
      {},
      { message: `Created: ${JSON.stringify(result!)}` }
    )
  );
};
