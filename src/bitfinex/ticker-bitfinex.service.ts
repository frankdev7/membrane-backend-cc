import axios from 'axios';
import { ResponseTickerBitfinexDto } from './dtos/response-ticker-bitfinex.dto';
import { Injectable } from '@nestjs/common';
import { Pairs } from 'src/utils/pairs.enum';

@Injectable()
export class TickerBitfinexService {
  async get(pair: Pairs): Promise<ResponseTickerBitfinexDto> {
    const url = `https://api-pub.bitfinex.com/v2/ticker/${pair}`;
    const response = await axios.get(url, {
      headers: {
        accept: 'application/json',
      },
    });
    const { data } = response;
    return {
      bidPrice: data[0],
      bidAmount: data[1],
      askPrice: data[2],
      askAmount: data[3],
    };
  }
}
