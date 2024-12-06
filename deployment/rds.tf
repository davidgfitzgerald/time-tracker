# Define an RDS PostgreSQL DB instance.
#
# Creates a DB instance in AWS that is not publicly accessible. It is
# on the same VPC as the tailscale subnet router so to access the DB instance, that 
# can be achieved via the tailnet.
resource "aws_db_instance" "postgres" {
  allocated_storage       = 20     # Free-tier limit, up to 20GB
  storage_type            = "gp2"  # General Purpose SSD
  engine                  = "postgres"
  engine_version          = "16.3"  # Default as of 8/11/24
  db_name                 = var.db_name
  username                = var.db_user
  password                = var.db_password
  port                    = var.db_port
  instance_class          = var.db_instance_class
  multi_az                = false  # Use Single-AZ for Free Tier
  skip_final_snapshot     = true   # Skip final snapshot during deletion (can be changed)
  backup_retention_period = 0      # Free-tier setting

  # Networking
  publicly_accessible    = false                                       # Restrict public internet access
  vpc_security_group_ids = [aws_security_group.rds_security_group.id]  # Allow communication to/from VPC subnet
  db_subnet_group_name   = aws_db_subnet_group.private.name
}

output "db_instance_endpoint" {
  value = aws_db_instance.postgres.endpoint
}

output "db_instance_id" {
  value = aws_db_instance.postgres.id
}

# output "db_instance_ip" {
#     value = aws_db_instance.postgres.ip
# }

# Security group to allow VPC access to RDS
resource "aws_security_group" "rds_security_group" {
  vpc_id = aws_default_vpc.default.id
  name   = "rds_access"

  ingress {
    from_port   = var.db_port
    to_port     = var.db_port
    protocol    = "tcp"
    cidr_blocks = [var.vpc_cidr] # Allow access from all of VPC
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# Define a subnet group containing all private VPC subnets
resource "aws_db_subnet_group" "private" {
  name = "private"
  subnet_ids = [
    aws_subnet.private-subnet-2a.id,
    aws_subnet.private-subnet-2b.id,
  ]
}

