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

module "populate_hn_data" {
  source = "./modules/upload_lambda_function"

  name        = "populate-hn-data"
  prefix      = var.application_id
  description = "Pulls data from Hacker News"
  source_dir  = "../populate-hn-data"
  handler     = "src/index.main"

  environment = {
    HOWMANY_STORIES = var.howmany_stories
    PGUSER          = var.db_user
    PGPASSWORD      = var.db_user_password
    PGDATABASE      = var.db_name
    PGHOST          = aws_db_instance.rds.address
    PGPORT          = aws_db_instance.rds.port
  }
  tags = {
    Application = var.application_id
  }
}

module "provision_db" {
  source = "./modules/upload_lambda_function"

  name        = "provision-db"
  prefix      = var.application_id
  description = "Sets the database schema"
  source_dir  = "../provision-db"
  handler     = "index.main"
  timeout     = 90

  environment = {
    DB_USER          = var.db_user
    DB_USER_PASSWORD = var.db_user_password
    PGHOST           = aws_db_instance.rds.address
    PGPORT           = aws_db_instance.rds.port
    PGDATABASE       = var.db_name
    PGUSER           = var.db_master_user
    PGPASSWORD       = var.db_master_password
  }
  tags = {
    Application = var.application_id
  }
}
