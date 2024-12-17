#!/bin/bash

# Run locally for the time being. This is like a lazy CI just 
# so I can focus on development and get changes pushed to prod.

# The full path to this dir, e.g.: ~/code/time-tracker/deployment/scripts
SCRIPT_DIR=$(dirname "$(realpath "$0")")

# Build and push docker app image to ECR
${SCRIPT_DIR}/build_and_push.sh

# cd to deployment/
pushd "${SCRIPT_DIR}/../" 1>/dev/null

# If --force is passed, deploy regardless of any 
# infrastructure changes that may incur
if [[ ! $1 = "--force" ]]; then

    # If --force is not passed and infrastructure 
    # is not correct, don't taint the EC2 
    # instance - abort
    terraform plan | grep "Your infrastructure matches the configuration"
    if [[ $? -ne 0 ]]; then
        echo "Deployment aborted."
        echo "Check terraform plan."

        # cd back to wherever this was called from
        popd 1>/dev/null
        exit 1
    fi
fi

# Taint the EC2 instance so it is forcibly re-deployed and
# runs a new docker image.
terraform taint aws_instance.ec2_time_tracker

if [[ ! $1 = "--force" ]]; then
    # Defensive: Make sure we don't unexpectedly change more infrastructure
    # than we expect to.
    terraform plan | grep "1 to add, 1 to change, 1 to destroy"
    if [[ $? -ne 0 ]]; then
        echo "Aborted deployment."
        echo "Check terraform plan."

        # cd back to wherever this was called from
        popd 1>/dev/null

        exit 1
    fi
fi

# Adjust the AWS infra.
#
# This will re-deploy the EC2 app instance. This
# instance uses a bootstrapping script to install
# docker, pull the new image from ECR and then run
# a (potentially) new docker container.
terraform apply -auto-approve  

# cd back to wherever this was called from
popd 1>/dev/null