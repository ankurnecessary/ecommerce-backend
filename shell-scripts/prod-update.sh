#!/bin/bash

# Define color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

# Check if Docker is installed
if ! docker --version >/dev/null 2>&1; then
  echo "***Docker is not installed or not functioning.***"
  exit 1
fi

# Check if AWS CLI is installed
if ! aws --version > /dev/null 2>&1; then
    echo  "***AWS CLI is not installed. Please install AWS CLI and try again.***"
    exit 1
fi

# Load environment variables from .env file
if [ -f .env ]; then
    export $(cat .env | sed 's/#.*//g' | xargs)
fi

# Building a new docker image using docker file `Dockerfile.prod`
echo -e "${BLUE}***Building a new docker image using Dockerfile.prod***${NC}"
docker buildx build --platform linux/amd64 --provenance=false -t docker-image:test -f Dockerfile.prod .
echo -e "${GREEN}***Docker image built sucessfully***${NC}"

# Tagging the docker image for AWS ECR
echo -e "${BLUE}***Tagging the docker image for AWS ECR***${NC}"
docker tag docker-image:test $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$AWS_LAMBDA_FUNCTION_NAME:latest
echo -e "${GREEN}***Tagging finished sucessfully***${NC}"

# AWS authentication before pushing the image to ECR
echo -e "${BLUE}***Logging into AWS ECR***${NC}"
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com
echo -e "${GREEN}***Logged in sucessfully***${NC}"

# Pushing the docker image to AWS ECR
echo -e "${BLUE}***Pushing Docker image to ECR***${NC}"
docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$AWS_LAMBDA_FUNCTION_NAME:latest
echo -e "${GREEN}***Docker image pushed sucessfully***${NC}"

# Updating the AWS Lambda function with the new docker image
echo -e "${BLUE}***Updating AWS Lambda function***${NC}"
aws lambda update-function-code \
--function-name $AWS_LAMBDA_FUNCTION_NAME \
--image-uri $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$AWS_LAMBDA_FUNCTION_NAME:latest \
--publish
echo -e "${GREEN}***AWS Lambda function updated sucessfully***${NC}"
