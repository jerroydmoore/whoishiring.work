output "api_service_endpoint" {
  value = aws_api_gateway_deployment.current.invoke_url
}
