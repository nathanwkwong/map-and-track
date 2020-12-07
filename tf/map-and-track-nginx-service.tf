resource "aws_ecs_service" "map_and_track_nginx_service" {
  name            = "map_and_track_nginx_service"
  iam_role        = "${aws_iam_role.ecs-service-role.name}"
  cluster         = "${aws_ecs_cluster.map_and_track_ecs_cluster.id}"
  task_definition = "${aws_ecs_task_definition.map_and_track_nginx.family}:${max("${aws_ecs_task_definition.map_and_track_nginx.revision}", "${data.aws_ecs_task_definition.map_and_track_server.revision}")}"
  depends_on      = [ "aws_ecs_service.map_and_track_server", "aws_ecs_service.map_and_track_nginx"]
  desired_count   = "${var.desired_capacity}"
  deployment_minimum_healthy_percent = "50" 
  deployment_maximum_percent = "100"
  lifecycle {
    ignore_changes = ["task_definition"]
  }
}