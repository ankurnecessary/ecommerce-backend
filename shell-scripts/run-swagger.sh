#!/bin/bash

CONTAINER_NAME="ecommerce-swagger"
PORT=8080
SPEC_PATH="$(pwd)/openapi.yaml"
MOUNT_PATH="/usr/share/nginx/html/openapi.yaml"
SWAGGER_IMAGE="swaggerapi/swagger-ui"

# Check if container exists
if [ "$(docker ps -a -q -f name=^/${CONTAINER_NAME}$)" ]; then
  echo "Container '$CONTAINER_NAME' already exists. Starting it..."
  docker start $CONTAINER_NAME
else
  echo "Container '$CONTAINER_NAME' not found. Creating and running it..."
  docker run -d -p $PORT:8080 \
    -v "$SPEC_PATH":"$MOUNT_PATH" \
    -v "$(pwd)/scripts/swagger/translator.js:/usr/share/nginx/configurator/translator.js" \
    --name $CONTAINER_NAME \
    $SWAGGER_IMAGE
fi

if command -v xdg-open &> /dev/null; then
  xdg-open "http://localhost:$PORT"
elif command -v open &> /dev/null; then
  open "http://localhost:$PORT"
else
  echo "Please open http://localhost:$PORT manually in your browser."
fi
