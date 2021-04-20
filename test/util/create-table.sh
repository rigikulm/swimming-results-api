#!/usr/bin/env bash
# Creates the swimming-results-db DynamoDB table
#
# This is required for staging a local instance of DynamoDB which currently
# cannot be done via SAM.
echo "Creating the swimming-results-db..."

# Move to the directory where this script is located which contains the JSON files
cd `dirname $0`
aws dynamodb create-table --endpoint-url http://localhost:8000 --cli-input-json file://swimming-results-table.json
exit 0