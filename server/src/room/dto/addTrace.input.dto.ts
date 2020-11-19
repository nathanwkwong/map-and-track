import { IsDate, IsNotEmpty, IsUUID, Length, MinLength } from 'class-validator';

export class AddTraceDto {
  @IsUUID("4")
  mapTraceId: string;
  
  @Length(2)
  @IsNotEmpty()
  coordinates: number[];

  @IsDate()
  @IsNotEmpty()
  createdAt: Date
}
