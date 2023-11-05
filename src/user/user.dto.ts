import { IsBoolean, IsNumber } from 'class-validator';

import { Optional } from '@nestjs/common';

export class UserDto {
    @Optional()
    firstName?: string;
    @Optional()
    lastName?: string;
}
export class UserResponse {
    email: string;
    // hash: string;
    username: string;
    firstName: string;
    lastName: string;
    isDeleted: boolean;
    isBanned: boolean;
    avatar: string;
    _id: string;
}
export class constraintsDto {
    @Optional()
    @IsNumber({ allowNaN: false, allowInfinity: false })
    limit: number = 10;
    @Optional()
    @IsNumber({ allowNaN: false, allowInfinity: false })
    offset: number = 0;
    @Optional()
    @IsBoolean()
    reverse: boolean = false;
}
