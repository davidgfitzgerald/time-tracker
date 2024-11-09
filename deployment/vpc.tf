# Define an AWS VPC (Virtual Private Cloud).
#
# I am thinking of this as similar to a VPN. It is a virtual
# network in the cloud that only the nodes that I define are 
# connected to.
resource "aws_vpc" "main" {
  cidr_block = "10.0.0.0/16"
}