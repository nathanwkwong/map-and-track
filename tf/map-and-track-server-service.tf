resource "aws_ecs_service" "map_and_track_server_service" {
  name            = "map_and_track_server_service"
  iam_role        = "${aws_iam_role.ecs-service-role.name}"
  cluster         = "${aws_ecs_cluster.film_ratings_ecs_cluster.id}"
  task_definition = "${aws_ecs_task_definition.map_and_track_server.family}:${max("${aws_ecs_task_definition.map_and_track_server.revision}", "${data.aws_ecs_task_definition.map_and_track_server.revision}")}"
  desired_count   = "${var.desired_capacity}"
  deployment_minimum_healthy_percent = "50" 
  deployment_maximum_percent = "100"
  lifecycle {
    ignore_changes = ["task_definition"]
  }
}