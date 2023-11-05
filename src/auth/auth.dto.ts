import {
    IsEmail,
    IsOptional,
    IsString,
    IsStrongPassword,
} from 'class-validator';

export class LoginDto {
    @IsEmail()
    email: string;
    @IsStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minNumbers: 1,
        minSymbols: 1,
        minUppercase: 1,
    })
    password: string;
}

export class UserCreateDto {
    @IsEmail()
    email: string;
    @IsStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minNumbers: 1,
        minSymbols: 1,
        minUppercase: 1,
    })
    password: string;
    @IsOptional()
    username: string;

    @IsString()
    firstName: string;
    @IsString()
    lastName: string;
}
