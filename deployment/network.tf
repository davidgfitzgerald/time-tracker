# Define private subnets.

resource "aws_default_vpc" "default" {
  tags = {
    Name = "Default VPC"
  }
}

# Private VPC routing table
resource "aws_route_table" "private" {
  vpc_id = aws_default_vpc.default.id
  
  # By default only routes privately to 172.31.0.0/16

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
