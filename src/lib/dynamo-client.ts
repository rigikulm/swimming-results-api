// Helper to construct a AWS SDK v3 DynamoDBClient
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { NodeHttpHandler } from '@aws-sdk/node-http-handler';
import { isLocal } from './local';

// Set the deafult HTTP timeout when connecting to DynamoDB
const requestHandler = new NodeHttpHandler({
  connectionTimeout: 100,
});

// Configure DynamoDB Client Configuration 
const ddbConfig: any = {
  logger: console,
  maxAttempts: 3,
  requestHandler
};

// DynamoDB client that will be resued across lambda invovations
let ddb: DynamoDBClient;

export function ddbClient(region: string = 'us-west-2'): DynamoDBClient {
  if (undefined === ddb) {
    ddbConfig.region = region;
    if (isLocal()) {
      ddbConfig['endpoint'] = 'http://dynamodb:8000';
    }
    ddb = new DynamoDBClient(ddbConfig);
  }

  return ddb;
} 



