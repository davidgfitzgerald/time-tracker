# Add SSH public key id_rsa.pub to EC2
resource "aws_key_pair" "macbook_id_rsa" {
  key_name   = "macbook-id-rsa" # Name of key pair in AWS
  public_key = file("~/.ssh/id_rsa.pub")
}