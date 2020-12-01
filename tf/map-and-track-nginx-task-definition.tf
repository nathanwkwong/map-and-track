data "aws_ecs_task_definition" "map_and_track_nginx" {
  task_definition = "${aws_ecs_task_definition.map_and_track_nginx.family}"
  depends_on = ["aws_ecs_task_definition.map_and_track_nginx"]
}

resource "aws_ecs_task_definition" "map_and_track_nginx" {
  family                = "map_and_track_nginx"
  container_definitions = <<DEFINITION
[
  {
    "name": "map_and_track_nginx",
    "image": "${var.map_and_track_nginx_image}",
    "essential": true,
    "portMappings": [
      {
        "hostPort": 80,
        "containerPort": 80
      },
      {
        "hostPort": 443,
        "containerPort": 443
      }
    ],
    "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "map_and_track_nginx",
          "awslogs-region": "${var.region}",
          "awslogs-stream-prefix": "ecs"
        }
    },
    "memory": 128,
  }
]
DEFINITION
}