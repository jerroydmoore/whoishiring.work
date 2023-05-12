# Setup RDS..done
# Deploy Lambda functions..done
# Create S3..done
# Create API Gateway..done
# Cloudfront setup..done
# Deploy to S3..done.. with gatsby
# Enable multiple environments..WIP
# Then deploy at a different location and test..WIP
# Then delete all the layers, the old lambda function, old IAM not used
# Delete the migration line from provision-db and re-commit it.

terraform {
  backend "remote" {
    organization = "whoishiring"

    workspaces {
      name = "whoishiring"
    }
  }
}

provider "aws" {
  profile = var.aws_profile
  region  = var.aws_region
}

data "aws_caller_identity" "current" {}
