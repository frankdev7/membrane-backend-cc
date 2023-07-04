import { Injectable } from '@nestjs/common';
import { TickerBitfinexService } from 'src/bitfinex/ticker-bitfinex.service';
import { RequestTickerDto } from './dtos/request-ticker.dto';
import { ResponseTickerDto } from './dtos/response-ticker.dto';

@Injectable()
export class TickerService {
  constructor(private readonly tickerBitfinexService: TickerBitfinexService) {}

  async trade(requestTickerDto: RequestTickerDto): Promise<ResponseTickerDto> {
    const response = await this.tickerBitfinexService.get(
      requestTickerDto.pair,
    );

    return {
      bidPrice: response.bidPrice,
      bidAmount: response.bidAmount,
      askPrice: response.askPrice,
      askAmount: response.askAmount,
    };
  }
}
