terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.16"
    }
  }

  required_version = ">= 1.2.0"
}

provider "aws" {
  region = "eu-central-1"
}

module "website" {
  source      = "./static-website"
  domain_name = "tracemap.eikemu.com"
}

module "cdn" {
  source              = "./cdn"
  website_domain_name = "tracemap.eikemu.com"
}
