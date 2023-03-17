output "api_gateway_base_url" {
  description = "URL to ivoke API Gateway, only accessible publically during testing"
  value       = aws_api_gateway_deployment.tracemap_api_gateway.invoke_url
}
