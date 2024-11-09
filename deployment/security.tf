resource "aws_security_group" "allow_ssh_only_me" {
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