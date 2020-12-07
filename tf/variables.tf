# main creds for AWS connection
# variable "aws_access_key_id" {
#   description = "AWS access key"
# }

# variable "aws_secret_access_key" {
#   description = "AWS secret access key"
# }

variable "ecs_cluster" {
  description = "map-and-track"
  default = "map-and-track-terraform"
}

# variable "ecs_key_pair_name" {
#   description = "map-and-track-terraform-v-key-pair.pem"
# }

variable "region" {
  description = "AWS region"
  default = "us-east-2"
}

# variable "availability_zone" {
#   description = "availability zone used for the film ratings, based on region"
#   default = {
#     eu-west-1 = "eu-west-1"
#   }
# }

# variable "db_password" {
#   description = "Database password"
# }

variable "map_and_track_client_image" {
  description = "Docker image for the film ratings application"
  default = "nathanwkwong/map-and-track-client"
}
variable "map_and_track_server_image" {
  description = "Docker image for the film ratings application"
  default = "nathanwkwong/map-and-track-server"
}

variable "map_and_track_nginx_image" {
  description = "Docker image for the film ratings application"
  default = "nathanwkwong/map-and-track-nginx"
}
########################### Test VPC Config ################################

variable "map_and_track_vpc" {
  description = "VPC for Film Ratings environment"
  default = "vpc-c06fc9ab"
}

variable "map_and_track_network_cidr" {
  description = "IP addressing for Film Ratings Network"
}

# variable "map_and_track_public_01_cidr" {
#   description = "Public 0.0 CIDR for externally accessible subnet"
# }

# variable "map_and_track_public_02_cidr" {
#   description = "Public 0.0 CIDR for externally accessible subnet"
# }

########################### Autoscale Config ################################

variable "max_instance_size" {
  description = "Maximum number of instances in the cluster"
  default = "1"
}

variable "min_instance_size" {
  description = "Minimum number of instances in the cluster"
  default = "1"
}

variable "desired_capacity" {
  description = "Desired number of instances in the cluster"
  default = "1"
}
