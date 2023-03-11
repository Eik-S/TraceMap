terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.16"
    }
  }

  required_version = ">= 1.2.0"

  backend "s3" {

    bucket         = "eike-terraform-state"
    key            = "state/terraform.tfstate"
    encrypt        = true
    dynamodb_table = "eike-terraform_tf_lockid"
  }
}

provider "aws" {
  region = "eu-central-1"
}

module "terraform_backend" {
  source = "./terraform-backend"
}

module "restriced_admin" {
  source              = "./restricted-admin"
  website_domain_name = "tracemap.eikemu.com"
}

module "website" {
  source      = "./static-website"
  domain_name = "tracemap.eikemu.com"
}

module "cdn" {
  source              = "./cdn"
  website_domain_name = "tracemap.eikemu.com"
}

module "koa_server" {
  source = "./koa-server"
}
