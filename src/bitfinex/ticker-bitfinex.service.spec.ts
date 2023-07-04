import { Test, TestingModule } from '@nestjs/testing';
import { TickerBitfinexService } from './ticker-bitfinex.service';
import axios from 'axios';
import { Pairs } from 'src/utils/pairs.enum';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('TickerBitfinexService', () => {
  let service: TickerBitfinexService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TickerBitfinexService],
    }).compile();

    service = module.get<TickerBitfinexService>(TickerBitfinexService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('get', () => {
    it('should return valid data', async () => {
      const mockData = [
        30801, 16.84893339, 30802, 19.84127436, -372, -0.0119334, 30801,
        1706.54630581, 31347, 30655,
      ];

      mockedAxios.get.mockResolvedValueOnce({ data: mockData });

      const pair = Pairs.BTCUSD; // Replace with the pair you want to test
      const result = await service.get(pair);

      expect(result).toEqual({
        bidPrice: mockData[0],
        bidAmount: mockData[1],
        askPrice: mockData[2],
        askAmount: mockData[3],
      });
      expect(mockedAxios.get).toHaveBeenCalledWith(
        `https://api-pub.bitfinex.com/v2/ticker/${pair}`,
        {
          headers: {
            accept: 'application/json',
          },
        },
      );
    });
  });
});
