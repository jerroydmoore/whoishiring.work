# Terraform

## Installation

Configure the aws profile `default` using `aws configure`

Install `tfenv` using `brew install tfenv`

Ensure a `secrets.tfvars` exists with the following contents

```
db_master_password="provide password here"
db_user_password="provide password here"
```

### Troubleshooting

Running on MacOS with ARM architecture and a binary is not available?

```sh
TFENV_ARCH=amd64
```

## Applying changes

```sh
terraform apply -var-file=secrets.tfvars'
```
