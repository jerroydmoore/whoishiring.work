variable "aws_profile" {
  default = "default"
}

variable "aws_region" {
  default = "us-west-1"
}

variable "application_id" {
  default = "whoishiring.work"
}

variable "db_master_password" {
  description = "Import this from secrets.tfvars using 'terraform apply -var-file=secrets.tfvars'"
}
