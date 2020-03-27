resource "aws_db_instance" "whoishiring" {
  identifier = "whoishiring"

  engine         = "postgres"
  engine_version = "11.5"
  instance_class = "db.t2.micro"

  storage_type          = "gp2"
  allocated_storage     = 20
  max_allocated_storage = 1000

  username = "postgres"
  password = var.db_master_password

  backup_retention_period = 7
  backup_window           = "08:58-09:28"
  copy_tags_to_snapshot   = true
  maintenance_window      = "tue:10:00-tue:10:30"

  deletion_protection = true
  publicly_accessible = true

  vpc_security_group_ids = [aws_security_group.whoishiring_database.id]
  # TODO seems like a good idea to enable this enable this
  # https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/UsingWithRDS.IAMDBAuth.Connecting.AWSCLI.PostgreSQL.html
  # iam_database_authentication_enabled = true

  tags = {
    Application = var.application_id
  }
}
