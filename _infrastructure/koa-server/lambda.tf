resource "aws_iam_role" "tracemap_api" {
  name        = var.tracemap_api_lambda_role_name
  description = "Role to allow lambda function '${var.tracemap_api_lambda_name}' to call AWS services"

  assume_role_policy = data.aws_iam_policy_document.tracemap_api_assume_role.json
}

data "aws_iam_policy_document" "tracemap_api_assume_role" {
  statement {
    effect  = "Allow"
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }
  }
}

data "aws_iam_policy_document" "tracemap_api" {
  statement {
    effect = "Allow"
    actions = [
      "kms:Decrypt"
    ]
    resources = [aws_kms_key.tracemap_api.arn]
  }

  statement {
    effect = "Allow"
    actions = [
      "dynamodb:GetItem",
      "dynamodb:Query",
      "dynamodb:PutItem",
    ]
    resources = [aws_dynamodb_table.tracemap_sessions.arn, aws_dynamodb_table.mastodon_apps.arn]
  }
}


resource "aws_iam_policy" "tracemap_api" {
  name        = "tracemap-api-policy"
  description = "Policies for lambda function '${var.tracemap_api_lambda_name}'"

  policy = data.aws_iam_policy_document.tracemap_api.json
}

resource "aws_iam_role_policy_attachment" "tracemap_api" {
  role       = aws_iam_role.tracemap_api.name
  policy_arn = aws_iam_policy.tracemap_api.arn
}

resource "aws_iam_role_policy_attachment" "tracemap_api_aws_lambda_basic_execution" {
  role       = aws_iam_role.tracemap_api.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_lambda_function" "tracemap_api" {
  function_name = var.tracemap_api_lambda_name
  filename      = "dummy-lambda.zip"
  runtime       = "nodejs18.x"
  role          = aws_iam_role.tracemap_api.arn
  handler       = "index.handler"

  environment {
    variables = {
      twitter_client_id_encrypted     = var.twitter_client_id_encrypted
      twitter_client_secret_encrypted = var.twitter_client_secret_encrypted
    }
  }
}

data "archive_file" "dummy_lambda" {
  type        = "zip"
  output_path = "dummy-lambda.zip"

  source {
    content  = "exports.handler = (e) => console.log(JSON.stringify(e, null, 2))"
    filename = "index.js"
  }
}

resource "aws_lambda_permission" "api_gateway_permission" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.tracemap_api.function_name
  principal     = "apigateway.amazonaws.com"

  # The /*/* portion grants access from any method on any resource
  # within the API Gateway "REST API".
  source_arn = "${aws_api_gateway_rest_api.tracemap_api_gateway.execution_arn}/*/*"
}
