// Helper to construct a AWS SDK v3 DynamoDBClient
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { NodeHttpHandler } from "@aws-sdk/node-http-handler";
import { isLocal } from "./local";

/**
 * @typedef {Object} ddbOptions           - DynamoDB Connection Options
 * @property {string} [region]            - AWS region, defaults to us-west-2
 * @property {number} [connectionTimeout] - connection timeout in millseconds,
 *                                          defaults to 100ms
 * @property {number} [maxAttempts]       - maximum times to retry the connection,
 *                                          defaults to 3
 * @property {string} [localEndpoint]     - URL for DynamoDB instance when run locally,
 *                                          defaults to http://dynamodb:8000
 */
export type ddbOptions = {
  region?: string;
  connectionTimeout?: number;
  maxAttempts?: number;
  localEndpoint?: string;
};

// Configure DynamoDB Client Configuration
let ddbConfig: any = {
  region: "us-west-2",
  logger: console,
  maxAttempts: 3,
};

// DynamoDB client that will be resued across lambda invovations
let ddb: DynamoDBClient;

/**
 * Creates an AWS V3 SDK DynamoDB client connection
 *
 * Only creates a new connection if one does not already exist,
 * otherwise reuses the existing connection.
 * @param {ddbOptions} [opt] - DynamoDB connection options
 * @returns {DynamoDBClient}
 */
export function ddbClient(opt: ddbOptions = {}): DynamoDBClient {
  let requestHandler: NodeHttpHandler;

  // Create a new DynamoDB connection if one does not already exist
  if (undefined === ddb) {
    // Process the Dynamo Config Options
    if (opt.hasOwnProperty("region")) {
      ddbConfig.region = opt.region;
    }

    if (opt.hasOwnProperty("maxAttempts")) {
      ddbConfig.maxAttempts = opt.maxAttempts;
    }

    if (opt.hasOwnProperty("connectionTimeout")) {
      requestHandler = new NodeHttpHandler({
        connectionTimeout: opt.connectionTimeout,
      });
    } else {
      requestHandler = new NodeHttpHandler({ connectionTimeout: 100 });
    }
    ddbConfig.requestHandler = requestHandler;
    if (isLocal()) {
      ddbConfig["endpoint"] = opt.localEndpoint || "http://dynamodb:8000";
    }
    console.log(ddbConfig);
    ddb = new DynamoDBClient(ddbConfig);
  }

  return ddb;
}
