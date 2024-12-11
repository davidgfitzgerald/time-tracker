resource "aws_eip" "time_tacker_ip" {
  domain = "vpc"

  instance                  = aws_instance.ec2_time_tracker.id
  associate_with_private_ip = "172.31.20.153"
}


resource "aws_instance" "ec2_time_tracker" {
  ami           = "ami-066a7fbea5161f451" # Amazon Linux 2023 AMI. Username is ec2-user
  instance_type = "t2.micro"
  key_name      = aws_key_pair.local_id_rsa.key_name
  subnet_id     = data.aws_subnets.default_vpc.ids[3] # One of the default VPC public subnets
  private_ip    = "172.31.20.153"

  iam_instance_profile = aws_iam_instance_profile.ec2_instance_profile.name

  vpc_security_group_ids = [
    aws_security_group.app_security_group.id,
  ]

  # Installs docker, pulls image and runs container
  user_data = file("${path.module}/scripts/install_and_run.sh") 
}

output "ec2_time_tracker" {
  value = aws_instance.ec2_time_tracker.private_ip
}

resource "aws_iam_instance_profile" "ec2_instance_profile" {
  name = "ec2-instance-profile"
  role = aws_iam_role.ec2_role.name
}

resource "aws_security_group" "app_security_group" {
  name        = "app-ec2-sg"
  description = "Security group for application EC2 instance"
  vpc_id      = aws_default_vpc.default.id

  # Allow SSH from the Tailscale subnet router
  # ingress {
  #   from_port   = 22
  #   to_port     = 22
  #   protocol    = "tcp"
  #   cidr_blocks = [aws_instance.tailscale-subnet-router.private_ip] # Allow only the bastion node
  # }

  # Allow internal VPC communication if necessary
  ingress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = [var.vpc_cidr] # Allow all traffic from within the VPC
  }

  # Allow all outbound traffic (default for EC2)
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "App EC2 SG"
  }
}