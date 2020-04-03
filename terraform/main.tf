# RDS done
# Lambda functions done
# Deploy to S3, not done...
# Cloudfront setup, not dont...
# Then delete all the layers, the old lambda function, old IAM not used
# Delete the migration line from provision-db and re-commit it.

provider "aws" {
  profile = var.aws_profile
  region  = var.aws_region
}
