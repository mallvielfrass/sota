import { IsOptional, IsString } from 'class-validator';

import { validateAndParseDto } from './dtoValidator';

class authDto {
    @IsString()
    Authorization: string;
    @IsOptional()
    @IsString()
    test: string;
}

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
    });
});
