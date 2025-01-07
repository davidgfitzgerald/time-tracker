# Deployment

This directory leverages terraform to deploy app infrastructure to AWS in the default Virtual Private Cloud (VPC).

The infrastructure defines an EC2 instance in the default VPC which can be configured using tailscale
to act as a subnet router to enable private, securely encrypted communication on a tailnet between the
developers local machine and the AWS VPC. This allows the developer to directly access the RDS
PostgreSQL DB instance for development purposes.

## Requirements

- an [AWS](https://aws.amazon.com/) account in `us-west-2`
- [Terraform](https://www.terraform.io/) installed (`>=1.9.8`)
- a default VPC in AWS
- a [Tailscale](https://tailscale.com/) account (and a tailnet)

## Setup

To set up the project for deployment, follow these steps:

1. Create `terraform.tfvars`

   ```bash
   cd deployment/
   cp terraform.tfvars.example terraform.tfvars
   ```

2. Fill out missing fields in `terraform.tfvars`

   **Note**: At the moment it is advised to leave most of the default env vars. The app
   does not yet support too much configuration.

3. Initialise `terraform`

   ```bash
   # This will install the hashicorp/aws provider
   terraform init
   ```

4. Plan your deployment

   ```bash
   # This won't do anything yet, it will just see what would happen
   terraform plan
   ```

   **Note**: Deploying may incur fees in AWS.

5. Deploy!

   ```bash
   terraform apply
   ```

   Confirm with `yes` if you are happy.


6. Create `.env.prod` in the root dir:

   ```bash
   cp .env.template .env.prod
   ```

7. Make amendments to `.env.prod`

   ```
   # Set POSTGRES_HOST to the value from the terraform output
   # Remove/unset the LOCAL_DEV variable
   # You will probably also need to set the ECR_URL variable in build_and_push.sh  
   ```

8. Set up tailscale subnet router on the EC2 instance:

   1. `ssh` into EC2 instance
   2. Run these commands to install and run tailscale

   ```bash
   sudo yum install -y yum-utils
   sudo yum-config-manager --add-repo https://pkgs.tailscale.com/stable/amazon-linux/2/tailscale.repo
   sudo yum install -y tailscale
   sudo systemctl enable --now tailscaled
   echo 'net.ipv4.ip_forward = 1' | sudo tee -a /etc/sysctl.d/99-tailscale.conf
   echo 'net.ipv6.conf.all.forwarding = 1' | sudo tee -a /etc/sysctl.d/99-tailscale.conf
   sudo sysctl -p /etc/sysctl.d/99-tailscale.conf
   sudo tailscale up --advertise-routes=172.31.0.0/16 --accept-dns=false
   ```

   3. Visit the link that appears in the terminal. Log into tailscale locally on the GUI to authorise the EC2 instance
   4. Login to https://login.tailscale.com/admin locally
   5. Follow all the steps in https://tailscale.com/kb/1019/subnets to configure the subnet router
   6. Add the AWS DNS to the tailnet to allow this:
      ```bash
      pgcli -h terraform-20241109232645798400000002.cpzvybhopwhq.us-west-2.rds.amazonaws.com -U admin -d time_tracker
      ```

## [app.tf](/deployment/app.tf)

Defines an EC2 instance in the cloud with a static IP that runs the app in a docker container.

## [config.tf](/deployment/config.tf)

Currently only `us-west-2` is supported but other AWS regions could be supported in future.

## [key.tf](/deployment/key.tf)

Adds an SSH key-pair to AWS such that you can SSH into the tailnet subnet router to manually
setup tailscale.

## [network.tf](/deployment/network.tf)

Defines the networking resources required in AWS to wire up the VPC in a way that enables
the RDS to communicate to other nodes in the VPC. For instance, this enables the tailscale
subnet router to communicate with the AWS RDS PostgreSQL database.

## [rds.tf](/deployment/rds.tf)

Defines the AWS RDS PostgreSQL DB instance. This is your database. The database will not be
accessible by the outside world directly. It will only be accessible via other nodes on the
VPC such as the tailscale subnet router which is the point of access for public internet traffic.

## [ssh.tf](/deployment/ssh.tf)

Defines a rule which can be attached to nodes in the VPC (such as the tailscale subnet router) to
allow you (and only you) to SSH into the node. This is provided for purposes of setting up tailscale
on the subnet router manually.

You should notice that the rule is commented out in `tailnet.tf`. This is where the rule would be temporarily
enabled for setup purposes.

## [tailnet.tf](/deployment/tailnet.tf)

This is where a lot of the networking magic happens.

This file defines an EC2 instance in the VPC which acts as a tailscale subnet router

Read more: https://tailscale.com/kb/1021/install-aws

Essentially, this node acts as a router such that traffic on your tailnet can be routed into the VPC to access nodes such as the RDS DB.

## [terraform.tfvars.example](/deployment/terraform.tfvars.example)

The environment variable template file for the deployment.

## [vars.tf](/deployment/vars.tf)

The definition of environment variables mapped to terraform variables for use through the deployment.

# CI

Check out the [/deployment/scripts/ci.sh](/deployment/scripts/ci.sh) script.

For the time being, a quick and dirty CI can be used to build, push and run a docker container in EC2 with:

```bash
./deployment/scripts/ci.sh
```

It is slow and by no means full proof but at least we have an automated method for deploying to prod now!
