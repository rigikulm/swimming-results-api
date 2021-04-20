#!/usr/bin/env bash
# Lists the contents of the swimming-results-db
#
# This is required for staging a local instance of DynamoDB which currently
# cannot be done via SAM.
echo "Listing records from swimming-results-db..."

aws dynamodb scan --endpoint-url http://localhost:8000 --table-name swimming-results-db
exit 0