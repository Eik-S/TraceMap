provider "aws" {
  alias  = "cdn_region"
  region = "us-east-1"
}


resource "aws_acm_certificate" "cert" {
  provider          = aws.cdn_region
  domain_name       = var.website_domain_name
  validation_method = "DNS"
  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_acm_certificate_validation" "cert" {
  provider                = aws.cdn_region
  certificate_arn         = aws_acm_certificate.cert.arn
  validation_record_fqdns = [for record in aws_route53_record.cert_validation : record.fqdn]

}
