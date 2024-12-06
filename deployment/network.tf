# Define networking in the default VPC.
resource "aws_default_vpc" "default" {
  tags = {
    Name = "Default VPC"
  }
}

# Get all subnets in the default VPC
data "aws_subnets" "default_vpc" {
  filter {
    name   = "vpc-id"
    values = [aws_default_vpc.default.id]
  }
}

output "default_vpc_subnet_ids" {
  value = [for s in data.aws_subnets.default_vpc.ids : s]
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
  availability_zone       = "${var.aws_region}a"
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
  availability_zone       = "${var.aws_region}b"
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
