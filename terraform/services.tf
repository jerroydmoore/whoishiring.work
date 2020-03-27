module "backend" {
  source = "./modules/upload_lambda_function"

  name        = "backend"
  prefix      = var.application_id
  description = "The API layer for ${var.domain_name}"
  source_dir  = "../backend"
  handler     = "src/index.main"
  # bucket      = aws_s3_bucket.staging_area.id
  environment = {
    DB_USER          = var.db_user
    DB_USER_PASSWORD = var.db_user_password
    PGDATABASE       = var.db_name
    PGHOST           = aws_db_instance.rds.address
    PGPORT           = aws_db_instance.rds.port
  }
  tags = {
    Application = var.application_id
  }
}

