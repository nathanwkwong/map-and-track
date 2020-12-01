# You may need to edit these variables to match your config
db_password= "password"
ecs_cluster="map_and_track_cluster"
ecs_key_pair_name="map-and-track-terraform-v-key-pair.pem"
region= "ap-northeast-2"
map_and_track_client_image= "nathanwkwong/map-and-track-client"

# no need to change these unless you want to
map_and_track_vpc = "map_and_track_vpc"
map_and_track_network_cidr = "210.0.0.0/16"
map_and_track_public_01_cidr = "210.0.0.0/24"
map_and_track_public_02_cidr = "210.0.10.0/24"
max_instance_size = 3
min_instance_size = 1
desired_capacity = 2
