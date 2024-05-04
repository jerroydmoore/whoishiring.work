resource "aws_db_instance" "rds" {
  identifier = var.db_name

  allow_major_version_upgrade = true
  apply_immediately           = true

  engine         = "postgres"
  engine_version = "12.17"
  instance_class = "db.t2.micro"

  storage_type          = "gp2"
  allocated_storage     = 20
  max_allocated_storage = 1000

  username = var.db_master_user
  password = var.db_master_password

  backup_retention_period = 7
  backup_window           = "08:58-09:28"
  copy_tags_to_snapshot   = true
  maintenance_window      = "tue:10:00-tue:10:30"

  deletion_protection = true
  publicly_accessible = true

  vpc_security_group_ids = [aws_security_group.rds_sg.id]
  # TODO seems like a good idea to enable this enable this
  # https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/UsingWithRDS.IAMDBAuth.Connecting.AWSCLI.PostgreSQL.html
  # iam_database_authentication_enabled = true

  tags = {
    Application = var.application_id
  }
}

resource "aws_security_group" "rds_sg" {
  name        = "${var.application_id}-database"
  description = "Protects the ${var.application_id} database"

  tags = {
    Application = var.application_id
  }
}

resource "aws_security_group_rule" "rds_ingress" {
  type              = "ingress"
  security_group_id = aws_security_group.rds_sg.id

  protocol         = "tcp"
  from_port        = 5432
  to_port          = 5432
  cidr_blocks      = ["0.0.0.0/0"]
  ipv6_cidr_blocks = ["::/0"]
}

resource "aws_security_group_rule" "rds_egress" {
  type              = "egress"
  security_group_id = aws_security_group.rds_sg.id

  from_port        = 0
  to_port          = 0
  protocol         = "-1"
  cidr_blocks      = ["0.0.0.0/0"]
  ipv6_cidr_blocks = ["::/0"]
}
