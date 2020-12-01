resource "aws_cloudwatch_log_group" "map_and_track_server" {
  name = "map_and_track_server"
}

resource "aws_cloudwatch_log_group" "map_and_track_client" {
  name = "map_and_track_client"
}

resource "aws_cloudwatch_log_group" "map_and_track_nginx" {
  name = "map_and_track_nginx"
}