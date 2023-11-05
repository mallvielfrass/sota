import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';

import { Optional } from '@nestjs/common';

export class MessageDto {
    @IsString()
    @IsNotEmpty()
    text: string;
}
export class constraintsDto {
    @Optional()
    @IsNumber({ allowNaN: false, allowInfinity: false })
    limit: number = 50;
    @Optional()
    @IsNumber({ allowNaN: false, allowInfinity: false })
    offset: number = 0;
    @Optional()
    @IsBoolean()
    reverse: boolean = true;
}
