import { BadRequestException, Injectable } from '@nestjs/common';
import axios from 'axios';
import { RequestBookBitfinexDto } from './dtos/request-book-bitfinex.dto';
import { filter, from, map, scan, takeWhile } from 'rxjs';
import { IBookMessageBitfinex } from 'src/bitfinex/dtos/book-bitfinex.dto';
import { Operations } from 'src/utils/operations.enum';

@Injectable()
export class BookBitfinexService {
  async get(requestBookBitfinexDto: RequestBookBitfinexDto): Promise<number> {
    const { amount, operation } = requestBookBitfinexDto;

    const url = `https://api-pub.bitfinex.com/v2/book/${requestBookBitfinexDto.pair}/P0?len=${requestBookBitfinexDto.len}`;
    const response = await axios.get(url, {
      headers: {
        accept: 'application/json',
      },
    });

    if (Operations.SELL === operation) {
      return await this.calculateSellPrice(response.data, amount);
    } else if (Operations.BUY === operation) {
      return await this.calculateBuyPrice(response.data, amount);
    }

    throw new BadRequestException();
  }

  private async calculateSellPrice(
    data: any[],
    amount: number,
  ): Promise<number> {
    const result = await from(data)
      .pipe(
        filter(
          (msg) => typeof msg === 'object' && msg[1] !== 0 && msg[2] > 0, // BID
        ),
        map((msg) => {
          const bookMessage: IBookMessageBitfinex = {
            price: msg[0],
            count: msg[1],
            amount: msg[2],
          };
          return bookMessage;
        }),
        scan(this.accumulatorFunction, {
          sumPrice: 0,
          remainingAmount: amount,
        }),
        takeWhile((acc) => acc.remainingAmount >= 0),
      )
      .toPromise();

    return result.sumPrice;
  }

  private async calculateBuyPrice(
    data: any[],
    amount: number,
  ): Promise<number> {
    const result = await from(data)
      .pipe(
        filter(
          (msg) => typeof msg === 'object' && msg[1] !== 0 && msg[2] < 0, // ASK
        ),
        map((msg) => {
          const bookMessage: IBookMessageBitfinex = {
            price: msg[0],
            count: msg[1],
            amount: Math.abs(msg[2]),
          };
          return bookMessage;
        }),
        scan(this.accumulatorFunction, {
          sumPrice: 0,
          remainingAmount: amount,
        }),
        takeWhile((acc) => acc.remainingAmount >= 0),
      )
      .toPromise();

    return result.sumPrice;
  }

  private accumulatorFunction(acc, bookMessage: IBookMessageBitfinex) {
    if (acc.remainingAmount <= 0) {
      return acc;
    }
    const amountToSubtract = Math.min(acc.remainingAmount, bookMessage.amount);
    acc.sumPrice += bookMessage.price * amountToSubtract;
    acc.remainingAmount -= amountToSubtract;
    return acc;
  }
}
