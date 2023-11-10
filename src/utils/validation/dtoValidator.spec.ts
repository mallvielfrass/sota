import { validateAndParseDto } from './dtoValidator';
import { authDto } from './dtoValidator.dto';

describe('dtoValidator', () => {
    describe('validateAuthJson True', () => {
        it('good#1', async () => {
            const result = await validateAndParseDto(authDto, {
                Authorization: 'test',
            });
            expect(result.status).toBeTruthy();
            expect(result.Data.Authorization).toBe('test');
        });
        it('good#2', async () => {
            const result = await validateAndParseDto(authDto, {
                Authorization: 'test',
                test: 'test',
            });
            expect(result.status).toBeTruthy();
            expect(result.Data.Authorization).toBe('test');
            expect(result.Data.test).toBe('test');
        });
    });
    describe('validateAuthJson False', () => {
        it('bad#1', async () => {
            const result = await validateAndParseDto(authDto, {
                Authorization: 3,
            });
            expect(result.status).not.toBeTruthy();
            // expect(result.Authorization).toBe('test');
        });
        it('bad#2 Without Authorization', async () => {
            const result = await validateAndParseDto(authDto, {
                test: 'test',
            });
            expect(result.status).not.toBeTruthy();
        });
        it('bad#3 Bad Body', async () => {
            const result = await validateAndParseDto(authDto, {
                title: '6KqV',
                emitName: 'auth',
                body: '',
            });
            expect(result.status).not.toBeTruthy();
        });
        it('bad#4 null', async () => {
            const result = await validateAndParseDto(authDto, null);
            expect(result.status).not.toBeTruthy();
        });
        it('bad#5 undefined', async () => {
            const result = await validateAndParseDto(authDto, undefined);
            expect(result.status).not.toBeTruthy();
        });
        it('bad#6 empty', async () => {
            const result = await validateAndParseDto(authDto, {});
            expect(result.status).not.toBeTruthy();
        });
    });
});
