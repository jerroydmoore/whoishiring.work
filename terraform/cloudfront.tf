locals {
  s3_origin_id = "S3-${var.frontend_s3_bucket}"
}

# Lambda@Edge and ACM need to be in us-east-1
provider "aws" {
  alias  = "us_east_1"
  region = "us-east-1"
}

resource "aws_s3_bucket" "frontend" {
  bucket = var.frontend_s3_bucket
  acl    = "public-read"
  website {
    index_document = "index.html"
    error_document = "404.html"
  }
  tags = {
    Application = var.application_id
  }
}

resource "aws_s3_bucket_policy" "frontend" {
  bucket = aws_s3_bucket.frontend.id
  policy = <<POLICY
{
  "Version"  : "2012-10-17",
  "Statement": [
    {
      "Sid"      : "PublicReadGetObject",
      "Action"   : "s3:GetObject",
      "Effect"   : "Allow",
      "Principal": "*",
      "Resource" : "arn:aws:s3:::${var.frontend_s3_bucket}/*"
    }
  ]
}
POLICY
}

# Decision: Provision the wildcard cert independently, so multiple environs can be deployed as subdomains
data "aws_acm_certificate" "frontend_domain" {
    provider = aws.us_east_1
    domain = var.cert_domain_name
}
# resource "aws_acm_certificate" "frontend_domain" {
#   provider          = aws.us_east_1
#   domain_name       = var.cert_domain_name
#   validation_method = "DNS"

#   tags = {
#     name        = var.application_id
#     Application = var.application_id
#   }

#   lifecycle {
#     create_before_destroy = true
#   }
# }

module "redirect_subfolders_to_index_html" {
  source = "./modules/upload_lambda_function"

  name        = "redirect-subfolders-to-index-html"
  prefix      = var.application_id
  description = "Allows users to browse subfolders and omit the index.html in the path in Cloudfront"
  source_dir  = "../cloudfront-redirect-subfolders-to-index-html"
  handler     = "src/index.main"
  timeout     = 1
  tags = {
    Application = var.application_id
  }
  grant_assume_role_to_services = "[\"lambda.amazonaws.com\", \"edgelambda.amazonaws.com\"]"
  publish                       = true
  providers = {
    aws = aws.us_east_1
  }
}

resource "aws_cloudfront_distribution" "s3_distribution" {
  origin {
    domain_name = aws_s3_bucket.frontend.bucket_domain_name
    origin_id   = local.s3_origin_id
  }

  enabled             = true
  is_ipv6_enabled     = true
  default_root_object = "index.html"
  aliases             = [var.domain_name]
  price_class         = var.cloudfront_price_class

  default_cache_behavior {
    allowed_methods        = ["GET", "HEAD"]
    cached_methods         = ["GET", "HEAD"]
    target_origin_id       = local.s3_origin_id
    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 2592000
    max_ttl                = 31536000
    compress               = true

    forwarded_values {
      query_string = false

      cookies {
        forward = "none"
      }
    }

    lambda_function_association {
      event_type = "origin-request"
      lambda_arn = module.redirect_subfolders_to_index_html.aws_lambda_qualified_arn
    }
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    acm_certificate_arn      = data.aws_acm_certificate.frontend_domain.arn
    minimum_protocol_version = "TLSv1.1_2016"
    ssl_support_method       = "sni-only"
  }

  tags = {
    Application = var.application_id
  }
}
