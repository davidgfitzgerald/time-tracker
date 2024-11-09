# Define an AWS VPC (Virtual Private Cloud).
#
# I am thinking of this as similar to a VPN. It is a virtual
# network in the cloud that only the nodes that I define are 
# connected to.
resource "aws_vpc" "main" {
  cidr_block = "10.69.0.0/16"
}

# Internet Gateway for VPC
resource "aws_internet_gateway" "main" {
  vpc_id = aws_vpc.main.id
}

# Route Table for VPC
resource "aws_route_table" "main" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.main.id
  }
}

# Define first subnet for the instances
resource "aws_subnet" "main_a" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = "10.69.1.0/24"
  availability_zone       = "us-west-2a"
  map_public_ip_on_launch = true
}

# Associate the route table with the first subnet
resource "aws_route_table_association" "main_a" {
  subnet_id      = aws_subnet.main_a.id
  route_table_id = aws_route_table.main.id
}

# Define second subnet (redundant)
resource "aws_subnet" "main_b" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = "10.69.2.0/24"
  availability_zone       = "us-west-2b"
  map_public_ip_on_launch = true
}


# Associate the route table with the second subnet
resource "aws_route_table_association" "main_b" {
  subnet_id      = aws_subnet.main_b.id
  route_table_id = aws_route_table.main.id
}

# Definte a subnet group containing both subnets
resource "aws_db_subnet_group" "main" {
  name = "main-db-subnet-group"
  subnet_ids = [
    aws_subnet.main_a.id,
    aws_subnet.main_b.id
  ]
}

# Security group to allow SSH into VPC
resource "aws_security_group" "allow_ssh_only_me" {
  name        = "allow_ssh_from_my_ip"
  description = "Allow SSH from my IP only"
  vpc_id = aws_vpc.main.id

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["xx.xx.xx.xx/32"] # Add your actual public IP address
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# Security group to allow VPC access to RDS
resource "aws_security_group" "rds_security_group" {
  vpc_id = aws_vpc.main.id
  name   = "rds_access"

  ingress {
    from_port   = var.db_port
    to_port     = var.db_port
    protocol    = "tcp"
    cidr_blocks = ["10.0.1.0/24", "10.0.2.0/24"]  # Allow access from within the VPC subnets
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}