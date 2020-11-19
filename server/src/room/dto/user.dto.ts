import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { User } from 'src/account/schemas/user.schema';

export class UserDto {
    @IsUUID()
    @IsNotEmpty()
    userId: string;

    @IsString()
    @IsNotEmpty()
    username: string;

}
