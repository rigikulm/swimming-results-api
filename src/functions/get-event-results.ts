// Get the results for a particular event for the logged in swimmer
import { DynamoDBClient, GetItemCommand } from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import response from '../lib/response';

// eslint-disable-next-line no-unused-vars
import { APIGatewayEvent } from "aws-lambda";

let ddb: DynamoDBClient;

export const handler = async (event: APIGatewayEvent) => {
    return Promise.resolve(response.success(200, {}, { message: 'Successful getEventResults' }));
};