import { IsDate, IsNotEmpty, IsUUID, Length, MinLength } from 'class-validator';

export class StopMapTraceDto {
  @IsUUID("4")
  mapTraceId: string;
  
}
