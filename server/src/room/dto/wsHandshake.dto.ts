import {  IsNotEmpty} from 'class-validator';
import { User } from 'src/account/schemas/user.schema';

export class wsHandshakeDto {
    @IsNotEmpty()
    roomId: string;

    @IsNotEmpty()
    user: User

    @IsNotEmpty()
    selfMapTraceId: string | null
}
