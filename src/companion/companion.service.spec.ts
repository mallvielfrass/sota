import { Test, TestingModule } from '@nestjs/testing';
import { CompanionService } from './companion.service';

describe('CompanionService', () => {
  let service: CompanionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CompanionService],
    }).compile();

    service = module.get<CompanionService>(CompanionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
