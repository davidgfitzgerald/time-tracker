#!/bin/bash

# Run locally for the time being. This is likely a lazy CI just 
# so I can focus on development and get changes pushed to prod.

# The full path to this dir, e.g.: ~/code/time-tracker/deployment/scripts
SCRIPT_DIR=$(dirname "$(realpath "$0")")
# echo "SCRIPT_DIR=${SCRIPT_DIR}"

# Build and push docker app image to ECR
${SCRIPT_DIR}/build_and_push.sh

# cd to deployment/
pushd "${SCRIPT_DIR}/../" 1>/dev/null

# Don't taint the EC2 instance if terraform
# infrastructure is not correct.
terraform plan | grep "Your infrastructure matches the configuration"
if [[ $? -ne 0 ]]; then
    echo "Aborted deployment."
    echo "Check terraform plan."

    # cd back to wherever this was called from
    popd 1>/dev/null

    exit 1
fi

# Taint the EC2 instance so it is forcibly re-deployed and
# picks up new changes.
terraform taint aws_instance.ec2_time_tracker

# Defensive: Make sure we don't unexpectedly change more infrastructure
terraform plan | grep "1 to add, 1 to change, 1 to destroy"
if [[ $? -ne 0 ]]; then
    echo "Aborted deployment."
    echo "Check terraform plan."

    # cd back to wherever this was called from
    popd 1>/dev/null

    exit 1
fi

# Rebuild the AWS infra
# Slightly playing with fire by adding -auto-approve.
# Since this is a solo development project I am 
# going to risk it and hope I don't get bitten.
terraform apply -auto-approve  

# cd back to wherever this was called from
popd 1>/dev/null