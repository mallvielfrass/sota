import {
    IsString,
    ValidationArguments,
    ValidationOptions,
    registerDecorator,
} from 'class-validator';

import { TransformFnParams } from 'class-transformer';

export function IsBearer(validationOptions?: ValidationOptions) {
    return function (object: object, propertyName: string) {
        registerDecorator({
            name: 'isBearer',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                validate(value: any, args: ValidationArguments) {
                    const param: TransformFnParams = args.object[args.property];
                    return param.value.startsWith('Bearer ');
                },
                defaultMessage(args: ValidationArguments) {
                    return `${args.property} must contain a Bearer string`;
                },
            },
        });
    };
}
export class AuthorizationDto {
    @IsString()
    @IsBearer()
    Authorization: string;
}
