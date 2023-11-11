import { IsNotEmpty, IsString } from 'class-validator';

import { IsBearer } from '../utils/validation/validators';

export class AuthorizationDto {
    @IsString()
    @IsNotEmpty()
    @IsBearer()
    Authorization: string;
}
export class JoinDto {
    @IsString()
    @IsNotEmpty()
    dialogId: string;
}
