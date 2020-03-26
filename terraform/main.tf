provider "aws" {
  profile = var.aws_profile
  region  = var.aws_region
}

resource "aws_security_group" "whoishiring_database" {
  name        = "whoishiring-database"
  description = "Protects the whoishiring database"

  tags = {
    Application = var.application_id
  }
}


resource "aws_security_group_rule" "whoishiring_database_ingress" {
  type              = "ingress"
  security_group_id = aws_security_group.whoishiring_database.id

  protocol         = "tcp"
  from_port        = 5432
  to_port          = 5432
  cidr_blocks      = ["0.0.0.0/0"]
  ipv6_cidr_blocks = ["::/0"]
}

resource "aws_security_group_rule" "whoishiring_database_egress" {
  type              = "egress"
  security_group_id = aws_security_group.whoishiring_database.id

  from_port        = 0
  to_port          = 0
  protocol         = "-1"
  cidr_blocks      = ["0.0.0.0/0"]
  ipv6_cidr_blocks = ["::/0"]
}
