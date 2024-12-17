#!/bin/bash

# This script is run locally to build and push the docker image to ECR.
# In the future is likely that this script would be run on some kind of
# CI service runner.

# Exit immediately if any command fails
set -e

# The full path to this dir, e.g.: ~/code/time-tracker/deployment/scripts
SCRIPT_DIR=$(dirname "$(realpath "$0")")

# cd to project root (where Dockerfile is)
pushd "${SCRIPT_DIR}/../../" 1>/dev/null

# AWS vars
REGION="us-west-2"
ECR_URL="521286727825.dkr.ecr.us-west-2.amazonaws.com/time-tracker-ecr-repo"
ECR_IMAGE="${ECR_URL}:latest"

# Login to AWS ECR / Docker
echo "Logging into AWS ECR with docker"
aws ecr get-login-password --region ${REGION} | docker login --username AWS --password-stdin ${ECR_URL}

# Set prod env vars required for build
set -o allexport; source .env.prod; set +o allexport

# Display env vars for debugging/info purposes
echo "POSTGRES_USER = ${POSTGRES_USER}"
echo "POSTGRES_PASSWORD = [REDACTED]"
echo "POSTGRES_DB = ${POSTGRES_DB}"
echo "POSTGRES_HOST = ${POSTGRES_HOST}"
echo "POSTGRES_PORT = ${POSTGRES_PORT}"

# Build the app docker image for linux/amd64 (AWS EC2 arch)
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

# cd back to wherever this was called from
popd 1>/dev/null