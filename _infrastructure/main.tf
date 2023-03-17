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
  website_domain_name = var.website_domain_name
}

module "website" {
  source      = "./static-website"
  domain_name = var.website_domain_name
}

module "cdn" {
  source              = "./cdn"
  website_domain_name = var.website_domain_name
}

module "koa_server" {
  source                          = "./koa-server"
  tracemap_api_lambda_name        = var.tracemap_api_lambda_name
  tracemap_api_lambda_role_name   = var.tracemap_api_lambda_role_name
  twitter_client_id_encrypted     = "AQICAHhUKn/gQTRcnfwPG8wbF21rSKpf3rjiq7iBoynS7xr23QGCx9BxCsw+RF+Vc7BFaQ0LAAAAgDB+BgkqhkiG9w0BBwagcTBvAgEAMGoGCSqGSIb3DQEHATAeBglghkgBZQMEAS4wEQQMSNPNQiJEDC/ttUB9AgEQgD3dWroZSC3gajQRLx4+mSjwFn9N+/BhAvRijFUoSy8vbws1ZS6D/of+nON8TGRjiSH2PHhIRRq/jOxxh73/"
  twitter_client_secret_encrypted = "AQICAHhUKn/gQTRcnfwPG8wbF21rSKpf3rjiq7iBoynS7xr23QHE1oCsry22knZxVys1GnujAAAAkjCBjwYJKoZIhvcNAQcGoIGBMH8CAQAwegYJKoZIhvcNAQcBMB4GCWCGSAFlAwQBLjARBAwNKpBNIDV+f/5CVakCARCATUQE8Z3z0nVm9PJZHSbqf1GKaPB7Lq67TItnOtht65EdZkV2CXJ+Ri9cj6hlIxE/QkSOfIpr+QaHzZzmBF6UBAfT2mD6RctYXdQFdFFY"
}
