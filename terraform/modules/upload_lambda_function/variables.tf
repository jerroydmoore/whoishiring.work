variable "name" {
  description = "(Required) A unique name for your Lambda Function"
}

variable "prefix" {
  description = "(Optional) A name prefix for all associated resources"
}


variable "description" {
  description = "(Optional) Description of what your Lambda Function does."
  default = ""
}

variable "source_dir" {
  description = "(Required) Create the lambda function's deployment package from 'src' and the a layer from node_modules"
}

variable "handler" {
  description = "(Required) The function entrypoint in your code"
}

# variable "bucket" {
#   description = "the S3 bucket to upload the directory to"
# }

variable "environment" {
  type    = map(string)
  default = null
  description = "(Optional) The Lambda environment's configuration settings. "
}

variable "tags" {
  default = {}
  description = "(Optional) A mapping of tags to assign to the object(s)"
}
