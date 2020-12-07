output "region" {
  value = "${var.region}"
}

output "map_and_track_vpc_id" {
  value = "${aws_vpc.map_and_track_vpc.id}"
}

# output "map_and_track_public_sn_01_id" {
#   value = "${aws_subnet.map_and_track_public_sn_01.id}"
# }

# output "map_and_track_public_sn_02_id" {
#   value = "${aws_subnet.map_and_track_public_sn_02.id}"
# }

# output "map_and_track_public_sg_id" {
#   value = "${aws_security_group.map_and_track_public_sg.id}"
# }

# output "ecs-service-role-arn" {
#   value = "${aws_iam_role.ecs-service-role.arn}"
# }

# output "ecs-instance-role-name" {
#   value = "${aws_iam_role.ecs-instance-role.name}"
# }

# output "film-ratings-app-target-group-arn" {
#   value = "${aws_alb_target_group.map_and_track_app_target_group.arn}"
# }

# output "film-ratings-db-target-group-arn" {
#   value = "${aws_lb_target_group.map_and_track_db_target_group.arn}"
# }

# output "mount-target-dns" {
#   description = "Address of the mount target provisioned"
#   value = "${aws_efs_mount_target.filmdbefs-mnt.0.dns_name}"
# }
