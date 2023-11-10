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
interface validatedResponse<T> {
    status: boolean;
    error: Array<string>;
    Data: NonNullable<T>;
}
export const validateAndParseDto = async <T>(
    validationSchema: new () => T,
    body: any,
): Promise<validatedResponse<T>> => {
    if (!body) {
        return {
            status: false,
            error: ['body must be an object'],
            Data: null,
        };
    }
    if (typeof body !== 'object') {
        return {
            status: false,
            error: ['body must be an object'],
            Data: null,
        };
    }

    const result = await validationPipe(validationSchema as any, body);
    if (!result.status) {
        return {
            status: false,
            error: result.error,
            Data: null,
        };
    }
    const typedBody = body as T;
    return { status: true, error: [], Data: typedBody };
};
// export function returnTyped<T>(value: T): T {
//     return value;
// }
export const anyToJson = (data: any) => {
    try {
        if (typeof data === 'object') {
            return { data: data };
        }
        if (typeof data !== 'string') {
            return { error: 'data must be a string' };
        }
        return { data: JSON.parse(data) };
    } catch (error) {
        return { error: error };
    }
};
