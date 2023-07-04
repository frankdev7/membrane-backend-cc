import { Test, TestingModule } from '@nestjs/testing';
import { BookBitfinexService } from './book-bitfinex.service';

describe('BookBitfinexService', () => {
  let service: BookBitfinexService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BookBitfinexService],
    }).compile();

    service = module.get<BookBitfinexService>(BookBitfinexService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
