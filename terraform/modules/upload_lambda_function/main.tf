data "aws_region" "current" {}
data "aws_caller_identity" "current" {}
data "archive_file" "source" {
  type        = "zip"
  output_path = "./.cache/upload_lambda_function/${var.name}_src.zip"
  # source_dir  = "${var.source_dir}/src"
  source_dir = var.source_dir
}

# Unfortunately, the zip strips away the ./node_modules/** part
# data "archive_file" "node_modules" {
#   type        = "zip"
#   output_path = "./.cache/upload_lambda_function/${var.name}_node_module.zip"
#   source_dir  = "${var.source_dir}/node_modules"
# }

# resource "aws_s3_bucket_object" "source" {
#   bucket  = var.bucket
#   key     = "${var.name}_src.zip"
#   source  = data.archive_file.source.output_path
#   etag    = filemd5(data.archive_file.source.output_path)
#   tags    = var.tags
# }

# resource "aws_s3_bucket_object" "node_modules" {
#   bucket  = var.bucket
#   key     = "${var.name}_node_module.zip"
#   source  = data.archive_file.node_modules.output_path
#   etag    = filemd5(data.archive_file.node_modules.output_path)
#   tags    = var.tags
# }

resource "aws_cloudwatch_log_group" "log_group" {
  name              = "/aws/lambda/${var.prefix}_${var.name}"
  retention_in_days = 14
}

resource "aws_iam_role" "iam_for_lambda" {
  name               = "${var.prefix}_${var.name}_iam_for_lambda"
  tags               = var.tags
  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
EOF
}

resource "aws_iam_policy" "lambda_logging" {
  name        = "lambda_${var.prefix}_${var.name}_logging"
  path        = "/${var.prefix}/"
  description = "IAM policy for logging from a lambda"

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "logs:CreateLogGroup",
      "Resource": "arn:aws:logs:${data.aws_region.current.name}:${data.aws_caller_identity.current.account_id}:*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "logs:CreateLogStream",
        "logs:PutLogEvents"
      ],
      "Resource": [
        "arn:aws:logs:${data.aws_region.current.name}:${data.aws_caller_identity.current.account_id}:log-group:/aws/lambda/${var.prefix}_${var.name}:*"
      ]
    }
  ]
}
EOF
}

resource "aws_iam_role_policy_attachment" "lambda_logs" {
  role       = aws_iam_role.iam_for_lambda.name
  policy_arn = aws_iam_policy.lambda_logging.arn
}


# resource "aws_lambda_layer_version" "node_modules" {
#   # s3_bucket = var.bucket
#   # s3_key    = aws_s3_bucket_object.node_modules.key
#   layer_name = "${var.prefix}_${var.name}_node_modules"
#   filename = data.archive_file.node_modules.output_path
#   source_code_hash = data.archive_file.node_modules.output_base64sha256
#   compatible_runtimes = [ "nodejs10.x", "nodejs12.x", "nodejs8.10" ]
# }

resource "aws_lambda_function" "function" {
  function_name = "${var.prefix}_${var.name}"
  description   = var.description
  filename      = data.archive_file.source.output_path
  # layers = [ aws_lambda_layer_version.node_modules.arn ]
  # s3_bucket = var.bucket
  # s3_key    = aws_s3_bucket_object.source.key
  source_code_hash = data.archive_file.source.output_base64sha256
  handler          = var.handler

  role = aws_iam_role.iam_for_lambda.arn

  runtime     = "nodejs12.x"
  memory_size = 128
  timeout     = var.timeout

  environment {
    variables = var.environment
  }
  tags = var.tags
  depends_on = [
    aws_iam_role_policy_attachment.lambda_logs,
    aws_cloudwatch_log_group.log_group
  ]
}
