data "aws_ecs_task_definition" "map_and_track_server" {
  task_definition = "${aws_ecs_task_definition.map_and_track_server.family}"
  depends_on = ["aws_ecs_task_definition.map_and_track_server"]
}

resource "aws_ecs_task_definition" "map_and_track_server" {
  family                = "map_and_track_server"
  container_definitions = <<DEFINITION
[
  {
    "name": "map_and_track_server",
    "image": "${var.map_and_track_server_image}",
    "essential": false,
    "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "map_and_track_server",
          "awslogs-region": "${var.region}",
          "awslogs-stream-prefix": "ecs"
        }
    },
    "memory": 512,
  }
]
DEFINITION
}