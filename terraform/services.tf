module "backend" {
  source = "./modules/upload_lambda_function"

  name        = "backend"
  prefix      = var.application_id
  description = "The API layer for whoishiring.work"
  source_dir  = "../backend"
  handler     = "src/index.main"
  # bucket      = aws_s3_bucket.staging_area.id
  environment = {
    DB_USER          = var.db_user
    DB_USER_PASSWORD = var.db_user_password
    PGDATABASE       = var.db_name
    PGHOST           = aws_db_instance.whoishiring.endpoint
    PGPORT           = var.db_port
  }
  tags = {
    Application = var.application_id
  }
}

