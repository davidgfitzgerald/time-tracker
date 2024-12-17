#!/bin/bash

# This bootstrapping script will run in the cloud in the 
# EC2 instance that runs the time-tracker app container. 
# It will install docker, pull the app docker image and 
# run the app container.

# Exit immediately if any command fails
set -e

# Redirect output and errors to a log file
exec > >(tee -a /var/log/bootstrap.log) 2>&1

# Start script
echo -e "\n\nStarting bootstrap.sh script\n\n"

# Install Docker
echo "Installing Docker..."
dnf install -y docker
echo "Docker installed."

# Start Docker service
echo "Starting docker service..."
sudo service docker start
echo "Docker service started."

# Add ec2-user to the docker group to avoid needing sudo.
# (Logging back into the shell appears to be required)
sudo usermod -a -G docker ec2-user

# Confirm Docker installation
docker --version
echo "Docker installed and started."

# Authenticate with AWS ECR
ECR_URL="521286727825.dkr.ecr.us-west-2.amazonaws.com/time-tracker-ecr-repo"
REGION="us-west-2"
echo "Authenticating with AWS ECR..."
aws ecr get-login-password --region ${REGION} | docker login --username AWS --password-stdin ${ECR_URL}
echo "Authenticated with AWS ECR."

# Pull docker image
ECR_IMAGE="${ECR_URL}:latest"
echo "Pulling docker image ..."
docker pull ${ECR_IMAGE}
echo "Docker image pulled."

# Run app in docker container
echo "Running docker container ..."
docker run -p 5173:5173 --rm ${ECR_IMAGE}
echo "Docker container running."

echo "Completed bootstrap.sh script"

