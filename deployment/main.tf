terraform {
  required_providers {
    aws = {
      source = "hashicorp/aws"
    }
  }

  required_version = ">= 1.2.0"
}

provider "aws" {
  region = "us-west-2"
}

resource "aws_instance" "my_ec2_instance" {
  # ami           = "ami-830c94e3"

  # Description
  # Amazon Linux 2023 is a modern, general purpose Linux-based OS that comes with 5 years of`
  # long term support. It is optimized for AWS and designed to provide a secure, stable and`
  # high-performance execution environment to develop and run your cloud applications.
  # Amazon Linux 2023 AMI 2023.6.20241031.0 x86_64 HVM kernel-6.1
  ami           = "ami-066a7fbea5161f451"

  instance_type = "t2.micro"

  # Attach the security group
  vpc_security_group_ids = [aws_security_group.allow_ssh.id]

  # Use the generated key pair
  key_name = "manual-key"
}

resource "aws_security_group" "allow_ssh" {
  name        = "allow_ssh_from_my_ip"
  description = "Allow SSH from my IP only"

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = [] # Add your actual public IP address
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# Output the instance's public IP
output "instance_ip" {
  value = aws_instance.my_ec2_instance.public_ip
}
