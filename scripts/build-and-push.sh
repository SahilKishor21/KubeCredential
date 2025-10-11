#!/bin/bash
set -e
REGISTRY=${1:-"your-registry"}
VERSION=${2:-"latest"}

echo "Building Docker images..."
docker build -t $REGISTRY/issuance-service:$VERSION ./backend/issuance-service
docker build -t $REGISTRY/verification-service:$VERSION ./backend/verification-service
docker build -t $REGISTRY/frontend:$VERSION ./frontend

echo "Pushing images..."
docker push $REGISTRY/issuance-service:$VERSION
docker push $REGISTRY/verification-service:$VERSION
docker push $REGISTRY/frontend:$VERSION
echo "Done!"
