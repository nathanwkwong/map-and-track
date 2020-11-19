import { IsDate, IsNotEmpty, IsUUID, Length, MinLength } from 'class-validator';

export class AddSpotDto {
  @Length(2)
  @IsNotEmpty()
  coordinates: number[];

  @IsDate()
  @IsNotEmpty()
  createdAt: Date
}
