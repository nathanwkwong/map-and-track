import { IsNotEmpty, IsUUID } from 'class-validator';

export class JoinRoomDto {
  @IsUUID("4")
  @IsNotEmpty()
  roomId: string;
}
