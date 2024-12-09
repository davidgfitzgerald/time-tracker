# Deployment

This directory leverages terraform to deploy app infrastructure to AWS in the default VPC.

The infrastructure defines an EC2 instance in the default VPC which can be configured using tailscale
to act as a subnet router to enable private securely encrypted communication on a tailnet between the 
developers local machine and the AWS VPC. This allows the developer to directly access the RDS 
PostgreSQL DB instance for development purposes.

## Requirements

- an AWS account
- Terraform installed (`>=1.9.8`)
- a default VPC in AWS
- a Tailscale account

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

    It is recommend to just fill out:
    - `db_user`
    - `db_password`
    - `my_ip`

3. Initialise `terraform`

    ```bash
    terraform init
    ```

4. Plan your deployment

    ```bash
    terraform plan
    ```

    **Note**: Deploying may incur fees in AWS.

5. Deploy!

    ```bash
    terraform apply
    ```

    Confirm with `yes` if you are happy.

## `config.tf`

Currently only `us-west-2` is supported but other AWS regions could be supported in future.

## `key.tf`

Adds an SSH key-pair to AWS such that you can SSH into the tailnet subnet router to manually 
setup tailscale.

## `network.tf`

Defines the networking resources required in AWS to wire up the VPC in a way that enables
the RDS to communicate to other nodes in the VPC. For instance, this enables the tailscale 
subnet router to communicate with the AWS RDS PostgreSQL database.

## `rds.tf`

Defines the AWS RDS PostgreSQL DB instance. This is your database. The database will not be 
accessible by the outside world directly. It will only be accessible via other nodes on the 
VPC such as the tailscale subnet router which is the point of access for public internet traffic.

## `ssh.tf`

Defines a rule which can be attached to nodes in the VPC (such as the tailscale subnet router) to 
allow you (and only you) to SSH into the node. This is provided for purposes of setting up tailscale 
on the subnet router manually.

You should notice that the rule is commented out in `tailnet.tf`. This is where the rule would be temporarily 
enabled for setup purposes.

## `tailnet.tf`

This is where a lot of the networking magic happens.

This file defines an EC2 instance in the VPC which acts as a tailscale subnet router

    Read more: https://tailscale.com/kb/1021/install-aws

Essentially, this node acts as a router such that traffic on your tailnet can be routed into the VPC to access nodes such as the RDS DB.

To set up tailscale on the EC2 instance:

1. Add tailscale security group
2. `ssh` into EC2 instance
3. Run these commands to install and run tailscale
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
4. Visit the link that appears in the terminal. Log into tailscale locally on the GUI to authorise the EC2 instance
5. Login to https://login.tailscale.com/admin locally
6. Follow all the steps in https://tailscale.com/kb/1019/subnets to configure the subnet router
7. Add the AWS DNS to the tailnet to allow this:
    ```bash
    pgcli -h terraform-20241109232645798400000002.cpzvybhopwhq.us-west-2.rds.amazonaws.com -U david -d time_tracker
    ```
8. Remove SSH access to EC2 instance

## `terraform.tfvars.example`

The environment variable template file for the deployment.

## `us-west-2-bundle.pem`

Required by the app such that the app can connect to the RDS DB securely via SSL.

## `vars.tf`

The definition of environment variables mapped to terraform variables for use through the deployment.