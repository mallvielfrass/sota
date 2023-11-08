import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

export * from 'class-validator';
export const validationPipe = async (
    schema: new () => object,
    requestObject: object,
) => {
    try {
        const transformedClass: any = plainToInstance(schema, requestObject);
        const errors = await validate(transformedClass);
        if (errors.length > 0) {
            // console.log('errors', errors);
            return false;
        }
        return true;
    } catch (error) {
        // console.log('error', error);
        return false;
    }
};
export const validateAndParseDto = async <T>(
    validationSchema: new () => T,
    body: any,
): Promise<NonNullable<T>> => {
    const result: any = await validationPipe(validationSchema as any, body);
    if (!result) {
        return null;
    }

    return body as T;
};
// export function returnTyped<T>(value: T): T {
//     return value;
// }
