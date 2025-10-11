#!/bin/bash
echo "Cleaning up..."
docker-compose down -v
find . -name "node_modules" -type d -prune -exec rm -rf '{}' +
find . -name "dist" -type d -prune -exec rm -rf '{}' +
find . -name "*.db" -type f -delete
echo "Cleanup complete!"
