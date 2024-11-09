# Define a bastion node that can only be SSH'd to by me.
#
# This node is used as a gateway to access other nodes on the VPC such as the RDS DB.
resource "aws_instance" "bastion" {
  ami                    = "ami-066a7fbea5161f451" # Amazon Linux 2023 AMI. Username is ec2-user
  instance_type          = "t2.micro"
  vpc_security_group_ids = [aws_security_group.allow_ssh_only_me.id]
  key_name               = aws_key_pair.macbook_id_rsa.key_name
}

# Output the bastion instance's public IP
output "bastion_ip" {
  description = "Public IP of the EC2 bastion instance"
  value       = aws_instance.bastion.public_ip
}