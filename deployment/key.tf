# Add SSH public key to EC2
resource "aws_key_pair" "local_id_rsa" {
  key_name   =  var.aws_key_pair_name
  public_key = file(var.public_key_path)
}
