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
echo -e "${GREEN}***Docker image built sucessfully***${NC}".

# AWS authentication before pushing the docker image to ECR
echo -e "${BLUE}***Logging into AWS ECR***${NC}"
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com
echo -e "${GREEN}***Logged in sucessfully***${NC}"

# Creating the AWS Lambda function with the docker image
echo -e "${BLUE}***Creating AWS ECR repository***${NC}"
aws ecr create-repository --repository-name $AWS_ECR_REPOSITORY_NAME --region $AWS_REGION --image-scanning-configuration scanOnPush=true --image-tag-mutability MUTABLE
echo -e "${GREEN}***AWS ECR repository created sucessfully***${NC}"

# Tagging the docker image for AWS ECR
echo -e "${BLUE}***Tagging the docker image for AWS ECR***${NC}"
docker tag docker-image:test $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$AWS_LAMBDA_FUNCTION_NAME:latest
echo -e "${GREEN}***Tagging finished sucessfully***${NC}"

# Pushing the docker image to AWS ECR
echo -e "${BLUE}***Pushing Docker image to ECR***${NC}"
docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$AWS_LAMBDA_FUNCTION_NAME:latest
echo -e "${GREEN}***Docker image pushed sucessfully***${NC}"

# Creating a new AWS role for AWS lamda execution
echo -e "${BLUE}***Creating a new AWS role for AWS lamda execution***${NC}"
aws iam create-role \
  --role-name lambda-ex \
  --assume-role-policy-document '{"Version": "2012-10-17","Statement": [{ "Effect": "Allow", "Principal": {"Service": "lambda.amazonaws.com"}, "Action": "sts:AssumeRole"}]}'
echo -e "${GREEN}***Role created sucessfully***${NC}"

# Attaching a new policy with AWS role 'lambda-ex' for AWS lamda execution
echo -e "${BLUE}***Attaching a new policy with AWS role for AWS lamda execution***${NC}"
aws iam attach-role-policy --role-name lambda-ex --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole
echo -e "${GREEN}***New policy attached sucessfully***${NC}"

# Creating a new AWS lamda function
echo -e "${BLUE}***Creating a new AWS lamda function***${NC}"
aws lambda create-function \
  --function-name $AWS_LAMBDA_FUNCTION_NAME \
  --package-type Image \
  --code ImageUri=$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$AWS_LAMBDA_FUNCTION_NAME:latest \
  --role arn:aws:iam::$AWS_ACCOUNT_ID:role/lambda-ex
echo -e "${GREEN}***AWS Lamda function created sucessfully***${NC}"
