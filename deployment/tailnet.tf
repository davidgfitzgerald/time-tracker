# Define a tailscale subnet router node that allows my tailnet to freely access the VPC.
#
# This node is used as a gateway to access other nodes on the VPC such as the RDS DB.
resource "aws_instance" "tailscale-subnet-router" {
  ami           = "ami-066a7fbea5161f451" # Amazon Linux 2023 AMI. Username is ec2-user
  instance_type = "t2.micro"
  key_name      = aws_key_pair.macbook_id_rsa.key_name
  subnet_id     = var.public_subnet # One of the default VPC public subnets

  vpc_security_group_ids = [
    aws_security_group.tailscale.id,
    
    # Useful when needing to SSH into the subnet router to re-setup tailscale
    # aws_security_group.allow_ssh_only_me.id,
  ]

  tags = {
    Name = "TailscaleSubnetRouterHost"
  }
}

# Useful when needing to SSH into the subnet router to re-setup tailscale
# output "tailscale_subnet_router_ip" {
#   value = aws_instance.tailscale-subnet-router.public_ip
# }

resource "aws_security_group" "tailscale" {
  name        = "tailscale-enable-direct-connections"
  description = "Security group for Tailscale subnet router. See https://tailscale.com/kb/1141/aws-rds"
  vpc_id      = aws_default_vpc.default.id

  ingress {
    description = "Allow UDP traffic from any IPv4 source for Tailscale"
    from_port   = 41641
    to_port     = 41641
    protocol    = "udp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description      = "Allow UDP traffic from any IPv6 source for Tailscale"
    from_port        = 41641
    to_port          = 41641
    protocol         = "udp"
    ipv6_cidr_blocks = ["::/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1" # Allows all outbound traffic
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "tailscale-sg"
  }
}
