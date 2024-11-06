variable "db_name" {
  default = "time_tracker"
}

variable "db_user" {
  default = "david"
}

variable "db_password" {
  default = "password" # Update with a strong password
}

variable "db_instance_class" {
  default = "db.t4g.micro" # Free-tier instance type for RDS PostgreSQL
}

variable "db_port" {
  default = 5432
}

variable "aws_region" {
  default = "us-west-2" # AWS region located in Oregon
  # default = "eu-west-2" # AWS region located in London
}
