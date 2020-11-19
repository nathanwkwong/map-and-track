import { IsBoolean, IsNotEmpty} from 'class-validator';

export class IsTraceSelfModeOnDto {
  @IsBoolean()
  @IsNotEmpty()
  isTraceSelfModeOn: boolean;
}
