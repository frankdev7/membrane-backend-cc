import { Test, TestingModule } from '@nestjs/testing';
import { TradeGateway } from './trade.gateway';
import { TradeService } from './trade.service';

describe('TradeGateway', () => {
  let gateway: TradeGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TradeGateway, TradeService],
    }).compile();

    gateway = module.get<TradeGateway>(TradeGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
