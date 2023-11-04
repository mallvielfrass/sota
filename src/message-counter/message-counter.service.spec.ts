import { Test, TestingModule } from '@nestjs/testing';
import { MessageCounterService } from './message-counter.service';

describe('MessageCounterService', () => {
  let service: MessageCounterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MessageCounterService],
    }).compile();

    service = module.get<MessageCounterService>(MessageCounterService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
