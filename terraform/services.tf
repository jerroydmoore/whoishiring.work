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

resource "aws_api_gateway_rest_api" "api_services" {
  name        = "whoishiring-test"
  description = "API for the whoishiring.work application"
  endpoint_configuration {
    types = ["REGIONAL"]
  }
  tags = {
    Application = var.application_id
  }
}

resource "aws_api_gateway_resource" "default" {
  rest_api_id = aws_api_gateway_rest_api.api_services.id
  parent_id   = aws_api_gateway_rest_api.api_services.root_resource_id
  path_part   = "{proxy+}"
}

resource "aws_api_gateway_method" "default_any" {
  rest_api_id   = aws_api_gateway_rest_api.api_services.id
  resource_id   = aws_api_gateway_resource.default.id
  http_method   = "ANY"
  authorization = "NONE"
  request_parameters = {
    "method.request.path.proxy" = true
  }
}

resource "aws_api_gateway_integration" "default_any" {
  rest_api_id             = aws_api_gateway_rest_api.api_services.id
  resource_id             = aws_api_gateway_resource.default.id
  http_method             = aws_api_gateway_method.default_any.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = module.backend.aws_lambda_invoke_arn
  content_handling        = "CONVERT_TO_TEXT"
  cache_key_parameters = [
    "method.request.path.proxy",
  ]
}

resource "aws_cloudwatch_log_group" "execution_logs" {
  name              = "API-Gateway-Execution-Logs_${aws_api_gateway_rest_api.api_services.id}/${var.api_stage_name}"
  retention_in_days = 14
}

resource "aws_api_gateway_deployment" "current" {
  depends_on = [
    aws_api_gateway_integration.default_any
  ]
  rest_api_id = aws_api_gateway_rest_api.api_services.id
  stage_name  = var.api_stage_name
}

resource "aws_api_gateway_method_settings" "s" {
  rest_api_id = aws_api_gateway_rest_api.api_services.id
  stage_name  = var.api_stage_name
  method_path = "*/*"
  depends_on  = [aws_api_gateway_deployment.current]

  settings {
    metrics_enabled        = false
    logging_level          = "INFO"
    throttling_burst_limit = 5
    throttling_rate_limit  = 20
  }
}

resource "aws_lambda_permission" "apigw_lambda" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = module.backend.aws_lambda_function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "arn:aws:execute-api:${var.aws_region}:${data.aws_caller_identity.current.account_id}:${aws_api_gateway_rest_api.api_services.id}/*/${aws_api_gateway_method.default_any.http_method}${aws_api_gateway_resource.default.path}"
}