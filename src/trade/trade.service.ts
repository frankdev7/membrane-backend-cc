import { Injectable } from '@nestjs/common';
import { RequestTradeDto } from './dtos/request-trade.dto';
import { ResponseTradeDto } from './dtos/response-trade.dto';
import { BookBitfinexService } from 'src/bitfinex/book-bitfinex.service';

@Injectable()
export class TradeService {
  constructor(private readonly bookBitfinexService: BookBitfinexService) {}

  async trade(requestTradeDto: RequestTradeDto): Promise<ResponseTradeDto> {
    const price = await this.bookBitfinexService.get({
      pair: requestTradeDto.pair,
      len: 25,
      amount: requestTradeDto.amount,
      operation: requestTradeDto.operation,
    });

    return {
      price,
    };
  }
}
