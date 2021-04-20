#!/usr/bin/env bash
# Creates records in the swimming-results-db DynamoDB table
#
# This is required for staging a local instance of DynamoDB which currently
# cannot be done via SAM.
echo "Staging records into the swimming-results-db..."

# Move to the directory where this script is located which contains the JSON files
cd `dirname $0`
aws dynamodb batch-write-item --endpoint-url http://localhost:8000 --request-items file://swimming-results.json
exit 0