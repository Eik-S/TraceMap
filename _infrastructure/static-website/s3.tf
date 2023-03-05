resource "aws_s3_bucket" "tracemap_frontend_bucket" {
  bucket = var.domain_name
}

resource "aws_s3_bucket_acl" "tracemap_frontend_bucket" {
  bucket = aws_s3_bucket.tracemap_frontend_bucket.id
  acl    = "private"
}

resource "aws_s3_bucket_website_configuration" "tracemap_frontend_bucket" {
  bucket = aws_s3_bucket.tracemap_frontend_bucket.id
  index_document {
    suffix = "index.html"
  }
  error_document {
    key = "index.html"
  }
}

resource "aws_s3_bucket_policy" "tracemap_frontend_bucket" {
  bucket = aws_s3_bucket.tracemap_frontend_bucket.id
  policy = data.aws_iam_policy_document.website_policy.json
}

data "aws_iam_policy_document" "website_policy" {
  statement {
    actions = [
      "s3:GetObject"
    ]
    principals {
      type        = "AWS"
      identifiers = ["arn:aws:iam::cloudfront:user/CloudFront Origin Access Identity EXBY0NKH36FWR"]
    }

    resources = [
      "arn:aws:s3:::${var.domain_name}/*"
    ]
  }

  statement {
    actions = [
      "s3:ListBucket"
    ]
    principals {
      type        = "AWS"
      identifiers = ["arn:aws:iam::cloudfront:user/CloudFront Origin Access Identity EXBY0NKH36FWR"]
    }

    resources = [
      "arn:aws:s3:::${var.domain_name}"
    ]
  }
}
