import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

export * from 'class-validator';
export const validationPipe = async (
    schema: new () => object,
    requestObject: object,
) => {
    const errorsRes: Array<string> = [];
    try {
        const transformedClass: any = plainToInstance(schema, requestObject);
        const errors = await validate(transformedClass);
        if (errors.length > 0) {
            errors.forEach((error) => {
                errorsRes.push(
                    error.constraints[Object.keys(error.constraints)[0]],
                );
            });
            return { status: false, error: errorsRes };
        }
        return { status: true, error: [] };
    } catch (error) {
        // console.log('error', error);
        return { status: false, error: [error] };
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
export const anyToJson = (data: any) => {
    try {
        if (typeof data === 'object') {
            return { data: data };
        }
        return { data: JSON.parse(data) };
    } catch (error) {
        return { error: error };
    }
};
