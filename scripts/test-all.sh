#!/bin/bash
set -e
echo "Running tests..."
cd backend/issuance-service && npm test
cd ../verification-service && npm test
echo "All tests passed!"
