import { IsNotEmpty, IsUUID } from 'class-validator';

export class SelfMapTraceIdUpdateDto {
    @IsNotEmpty()
    @IsUUID()
    selfMapTraceId: string;
}