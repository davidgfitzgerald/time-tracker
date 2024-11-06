provider "aws" {
  region = var.aws_region
}

resource "aws_db_instance" "postgres" {
  allocated_storage    = 20  # Free-tier limit, up to 20GB
  storage_type         = "gp2"  # General Purpose SSD
  engine               = "postgres"
  # engine_version       = "13.4"  # Choose a free-tier supported version
  instance_class       = var.db_instance_class
  db_name              = var.db_name
  username             = var.db_user
  password             = var.db_password
  port                 = var.db_port
  multi_az             = false  # Use Single-AZ for Free Tier
  publicly_accessible  = false  # Restrict access to the VPC only
  skip_final_snapshot  = true   # Skip final snapshot during deletion (can be changed)
  backup_retention_period = 0  # Free-tier setting

  # parameter_group_name = "default.postgres13"  # Configuration to use
}

output "db_instance_endpoint" {
  value = aws_db_instance.postgres.endpoint
}

output "db_instance_id" {
  value = aws_db_instance.postgres.id
}