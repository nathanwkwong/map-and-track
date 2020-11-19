import { IsNotEmpty, IsUUID, MinLength } from 'class-validator';

export class CreateRoomDto {
  @MinLength(1)
  @IsNotEmpty()
  roomName: string;
}
