resource "aws_iam_role" "restricted_admin" {
  name               = "terraformRestrictedAdmin"
  assume_role_policy = data.aws_iam_policy_document.restricted_admin_assume_role.json
}

data "aws_iam_policy_document" "restricted_admin_assume_role" {
  statement {
    sid = "trustedAccountIds"

    effect  = "Allow"
    actions = ["sts:AssumeRole"]

    principals {
      type        = "AWS"
      identifiers = ["arn:aws:iam::643625685022:user/eikePrivateFullAccessAdmin"]
    }
  }

  statement {
    sid = "githubAssume"

    effect  = "Allow"
    actions = ["sts:AssumeRoleWithWebIdentity"]

    condition {
      test     = "StringLike"
      values   = ["repo:Eik-S/tracemap:*"]
      variable = "token.actions.githubusercontent.com:sub"
    }

    principals {
      type = "Federated"

      identifiers = [aws_iam_openid_connect_provider.github_oidc.arn]
    }
  }
}

resource "aws_iam_policy" "restricted_admin" {
  name        = "restriced-admin-policy"
  description = "Permissions to aws resources used by github actions"
  policy      = data.aws_iam_policy_document.restricted_admin.json
}

resource "aws_iam_role_policy_attachment" "github_actions" {
  role       = aws_iam_role.restricted_admin.name
  policy_arn = aws_iam_policy.restricted_admin.arn
}

data "aws_iam_policy_document" "restricted_admin" {
  # Allow listing of terraform state folder
  statement {
    actions   = ["s3:ListBucket", "s3:GetBucketVersioning"]
    resources = ["arn:aws:s3:::eike-terraform-state"]
  }

  # Allow put and get to this roles state s3 subfolder
  statement {
    actions   = ["s3:GetObject", "s3:PutObject"]
    resources = ["arn:aws:s3:::eike-terraform-state/${aws_iam_role.restricted_admin.name}/*"]
  }

  statement {
    actions = [
      "dynamodb:DeleteItem",
      "dynamodb:GetItem",
      "dynamodb:PutItem"
    ]
    resources = ["arn:aws:dynamodb:eu-central-1:643625685022:table/eike-terraform_tf_lockid"]
  }

  statement {
    effect = "Allow"
    actions = [
      "s3:ListAllMyBuckets"
    ]
    resources = ["*"]
  }

  statement {
    sid    = "s3Access"
    effect = "Allow"
    actions = [
      # Sync built website to s3 bucket
      "s3:PutObject",
      "s3:GetObject",
      "s3:DeleteObject",
      "s3:ListBucket"
    ]
    resources = [
      "arn:aws:s3:::${var.website_domain_name}",
      "arn:aws:s3:::${var.website_domain_name}/*"
    ]
  }

  statement {
    sid = "CloudFrontAccess"

    actions = [
      "cloudfront:GetInvalidation",
      "cloudfront:CreateInvalidation"
    ]

    resources = [
      "arn:aws:cloudfront::643625685022:distribution/E3VLBU7WSF9N46"
    ]
  }

  statement {
    sid = "ApiLambdaAccess"

    actions = [
      "lambda:UpdateFunctionCode"
    ]

    resources = [
      "arn:aws:lambda:eu-central-1:643625685022:function:tracemap-api"
    ]
  }
}
