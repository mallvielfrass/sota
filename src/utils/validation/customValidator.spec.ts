import { validateAndParseDto } from './dtoValidator';
import { withCustomValidatorDto } from './dtoValidator.dto';

describe('with custom validator', () => {
    it('good#1', async () => {
        const result = await validateAndParseDto(withCustomValidatorDto, {
            Authorization: 'Bearer test',
        });
        expect(result.status).toBeTruthy();
        expect(result.Data.Authorization).toBe('Bearer test');
    });
    it('good#2', async () => {
        const result = await validateAndParseDto(withCustomValidatorDto, {
            Authorization: 'Bearer test',
            test: 'test',
        });
        expect(result.status).toBeTruthy();
        expect(result.Data.Authorization).toBe('Bearer test');
    });
});
