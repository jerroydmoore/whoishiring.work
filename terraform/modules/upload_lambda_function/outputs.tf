output "aws_lambda_invoke_arn" {
  value = aws_lambda_function.function.invoke_arn
}

output "aws_lambda_function_name" {
  value = aws_lambda_function.function.function_name
}

output "aws_lambda_qualified_arn" {
  value = aws_lambda_function.function.qualified_arn
}