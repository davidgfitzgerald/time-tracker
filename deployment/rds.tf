# Define an RDS PostgreSQL DB instance.
#
# Creates a DB instance in AWS that is not publicly accessible. It is
# on the same VPC as the bastion so to access the DB instance, that must be
# done via the bastion.
resource "aws_db_instance" "postgres" {
  allocated_storage       = 20    # Free-tier limit, up to 20GB
  storage_type            = "gp2" # General Purpose SSD
  engine                  = "postgres"
  engine_version          = "16.3" # Default as on 8/11/24
  instance_class          = var.db_instance_class
  db_name                 = var.db_name
  username                = var.db_user
  password                = var.db_password
  port                    = var.db_port
  multi_az                = false # Use Single-AZ for Free Tier
  skip_final_snapshot     = true  # Skip final snapshot during deletion (can be changed)
  backup_retention_period = 0     # Free-tier setting

  # Networking
  publicly_accessible     = false # Restrict access to the VPC only
  vpc_security_group_ids  = [aws_security_group.rds_security_group.id]  # Allow communication to/from VPC subnet
  db_subnet_group_name    = aws_db_subnet_group.main.name
}

output "db_instance_endpoint" {
  value = aws_db_instance.postgres.endpoint
}

output "db_instance_id" {
  value = aws_db_instance.postgres.id
}