#!/bin/bash

# Build and push the time-tracker docker image to ECR
REGION="us-west-2"
ECR_URL="521286727825.dkr.ecr.us-west-2.amazonaws.com/time-tracker-ecr-repo"
ECR_IMAGE="${ECR_URL}:latest"

# Login
echo "Logging into AWS ECR with docker"
aws ecr get-login-password --region ${REGION} | docker login --username AWS --password-stdin ${ECR_URL}

set -o allexport; source .env; set +o allexport
echo "POSTGRES_USER = ${POSTGRES_USER}"
echo "POSTGRES_PASSWORD = [REDACTED]"
echo "POSTGRES_DB = ${POSTGRES_DB}"
echo "POSTGRES_HOST = ${POSTGRES_HOST}"
echo "POSTGRES_PORT = ${POSTGRES_PORT}"

# Build the app docker image for linux
docker build --target app \
    --build-arg POSTGRES_USER=${POSTGRES_USER} \
    --build-arg POSTGRES_PASSWORD=${POSTGRES_PASSWORD} \
    --build-arg POSTGRES_DB=${POSTGRES_DB} \
    --build-arg POSTGRES_HOST=${POSTGRES_HOST} \
    --build-arg POSTGRES_PORT=${POSTGRES_PORT} \
    --platform linux/amd64 \
    -t time-tracker .

# Tag the ECR image to match the local one
docker tag time-tracker:latest ${ECR_IMAGE}

# Push the image to ECR
docker push ${ECR_IMAGE}