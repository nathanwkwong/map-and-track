resource "aws_ecs_service" "map_and_track_client_service" {
  name            = "map_and_track_client_service"
  iam_role        = "${aws_iam_role.ecs-service-role.name}"
  cluster         = "${aws_ecs_cluster.film_ratings_ecs_cluster.id}"
  task_definition = "${aws_ecs_task_definition.map_and_track_client.family}:${max("${aws_ecs_task_definition.map_and_track_client.revision}", "${data.aws_ecs_task_definition.map_and_track_client.revision}")}"
  desired_count   = "${var.desired_capacity}"
  deployment_maximum_percent = "100"
  #health - allows the service to stop a container task in order to use the resource freed up to start a new version of the container task when rolling deployment
  deployment_minimum_healthy_percent = "50" 
  lifecycle {
    ignore_changes = ["task_definition"]
  }

}