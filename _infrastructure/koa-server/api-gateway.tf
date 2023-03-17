resource "aws_api_gateway_rest_api" "tracemap_api_gateway" {
  name        = "tracemap_backend_api"
  description = "API Gateway routing to tracemap koa server"
}

resource "aws_api_gateway_resource" "proxy" {
  rest_api_id = aws_api_gateway_rest_api.tracemap_api_gateway.id
  parent_id   = aws_api_gateway_rest_api.tracemap_api_gateway.root_resource_id
  path_part   = "{proxy+}"
}

resource "aws_api_gateway_method" "proxy" {
  rest_api_id   = aws_api_gateway_rest_api.tracemap_api_gateway.id
  resource_id   = aws_api_gateway_resource.proxy.id
  http_method   = "ANY"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "lambda" {
  rest_api_id = aws_api_gateway_rest_api.tracemap_api_gateway.id
  resource_id = aws_api_gateway_method.proxy.resource_id
  http_method = aws_api_gateway_method.proxy.http_method

  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.tracemap_api.invoke_arn
}

resource "aws_api_gateway_deployment" "tracemap_api_gateway" {
  depends_on = [
    aws_api_gateway_integration.lambda
  ]

  rest_api_id = aws_api_gateway_rest_api.tracemap_api_gateway.id
  stage_name  = "api"
}
