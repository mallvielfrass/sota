import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

import { IsBearer } from './validators';

export class authDto {
    @IsString()
    Authorization: string;
    @IsOptional()
    @IsString()
    test: string;
}

export class withCustomValidatorDto {
    @IsBearer()
    @IsString()
    @IsNotEmpty()
    Authorization: string;
}
