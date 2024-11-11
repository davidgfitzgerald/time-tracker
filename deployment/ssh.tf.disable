# Security group to allow SSH into default VPC
resource "aws_security_group" "allow_ssh_only_me" {
  name        = "allow_ssh_from_my_ip"
  description = "Allow SSH from my IP only"
  vpc_id      = aws_default_vpc.default.id

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["${var.my_ip}/32"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}