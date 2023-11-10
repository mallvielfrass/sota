import {
    ValidationArguments,
    ValidationOptions,
    registerDecorator,
} from 'class-validator';

export function IsBearer(validationOptions?: ValidationOptions) {
    return function (object: object, propertyName: string) {
        registerDecorator({
            name: 'isBearer',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                validate(value: any, args: ValidationArguments) {
                    //  const param: TransformFnParams = args.object[args.property];
                    return value?.startsWith('Bearer ');
                },
                defaultMessage(args: ValidationArguments) {
                    return `${args.property} must contain a Bearer string`;
                },
            },
        });
    };
}
