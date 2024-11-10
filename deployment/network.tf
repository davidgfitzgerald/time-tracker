# Define networking in the default VPC.

resource "aws_default_vpc" "default" {
  tags = {
    Name = "Default VPC"
  }
}

# Private VPC routing table
resource "aws_route_table" "private" {
  vpc_id = aws_default_vpc.default.id

  # By default only routes privately to 172.31.0.0/16 (VPC-wide)

  tags = {
    Name = "Private Route Table"
  }
}

# Define first private subnet for the RDS
resource "aws_subnet" "private-subnet-2a" {
  vpc_id                  = aws_default_vpc.default.id
  cidr_block              = "172.31.64.0/20"
  availability_zone       = "us-west-2a"
  map_public_ip_on_launch = false

  tags = {
    Name = "private-subnet-2a"
  }
}

# Associate the private route table with the first subnet
resource "aws_route_table_association" "main_a" {
  subnet_id      = aws_subnet.private-subnet-2a.id
  route_table_id = aws_route_table.private.id

}

# Define second private subnet for the RDS
resource "aws_subnet" "private-subnet-2b" {
  vpc_id                  = aws_default_vpc.default.id
  cidr_block              = "172.31.80.0/20"
  availability_zone       = "us-west-2b"
  map_public_ip_on_launch = false

  tags = {
    Name = "private-subnet-2b"
  }
}

# Associate the private route table with the first subnet
resource "aws_route_table_association" "main_b" {
  subnet_id      = aws_subnet.private-subnet-2b.id
  route_table_id = aws_route_table.private.id
}

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
