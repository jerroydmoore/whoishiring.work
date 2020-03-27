variable "aws_profile" {
  default = "default"
}

variable "aws_region" {
  default = "us-west-1"
}

variable "application_id" {
  default = "whoishiring"
}

variable "db_name" {
  default = "whoishiring"
}

variable "db_port" {
  default = 5432
}

variable "db_user" {
  default     = "whoishiring"
  description = "The username of the regular use used to to access the database by services"
}

variable "db_master_user" {
  default = "postgres"
}

variable "db_master_password" {
  description = "Import this from secrets.tfvars using 'terraform apply -var-file=secrets.tfvars'"
}

variable "db_user_password" {
  description = "Import this from secrets.tfvars using 'terraform apply -var-file=secrets.tfvars'"
}

variable "howmany_stories" {
  default     = 1
  description = "How many Who is hiring posts or stories to crawl through"
}
