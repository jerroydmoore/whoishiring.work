
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
