provider "aws" {
  region = var.aws_region
}

# Define your security group for RDS
resource "aws_security_group" "rds_security_group" {
  name        = "rds-sg"
  description = "Allow PostgreSQL access from my local machine"

  # Add an inbound rule to allow access from your local machine's IP
  ingress {
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    cidr_blocks = []  # IP won't be added to version control
  }

  # Optional: outbound rule (allow all traffic)
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"  # -1 means all protocols
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_db_instance" "postgres" {
  allocated_storage    = 20  # Free-tier limit, up to 20GB
  storage_type         = "gp2"  # General Purpose SSD
  engine               = "postgres"
  # engine_version       = "13.4"  # Choose a free-tier supported version
  engine_version       = "16.3"  # Default as on 8/11/24
  instance_class       = var.db_instance_class
  db_name              = var.db_name
  username             = var.db_user
  password             = var.db_password
  port                 = var.db_port
  multi_az             = false  # Use Single-AZ for Free Tier
  publicly_accessible  = false  # Restrict access to the VPC only
  skip_final_snapshot  = true   # Skip final snapshot during deletion (can be changed)
  backup_retention_period = 0  # Free-tier setting

  vpc_security_group_ids = [aws_security_group.rds_security_group.id]
  # parameter_group_name = "default.postgres13"  # Configuration to use
}

output "db_instance_endpoint" {
  value = aws_db_instance.postgres.endpoint
}

output "db_instance_id" {
  value = aws_db_instance.postgres.id
}