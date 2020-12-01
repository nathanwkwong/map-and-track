data "aws_ecs_task_definition" "map_and_track_client" {
  task_definition = "${aws_ecs_task_definition.map_and_track_client.family}"
  depends_on = ["aws_ecs_task_definition.map_and_track_client"]
}

resource "aws_ecs_task_definition" "map_and_track_client" {
  family                = "map_and_track_client"
  container_definitions = <<DEFINITION
[
  {
    "name": "map_and_track_client",
    "image": "${var.map_and_track_client_image}",
    "essential": false,
    "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "map_and_track_client",
          "awslogs-region": "${var.region}",
          "awslogs-stream-prefix": "ecs"
        }
    },
    "memory": 128,
  }
]
DEFINITION
}