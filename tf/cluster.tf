resource "aws_ecs_cluster" "map_and_track_ecs_cluster" {
  name = "${var.ecs_cluster}"
}
