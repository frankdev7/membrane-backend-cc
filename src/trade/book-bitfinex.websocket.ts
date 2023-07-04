import { WebSocket } from 'ws';
import { Subject, filter, map, scan, skip, takeWhile } from 'rxjs';
import { book } from 'src/utils/events.bitfinex';
import { Pairs } from 'src/utils/pairs.enum';
import { IBookMessageBitfinex } from './dtos/book-bitfinex.dto';
import { Operations } from 'src/utils/operations.enum';

export class BookBitFinexWebSocket {
  private ws: WebSocket;

  public data$ = new Subject<any>();
  public filteredDataBuy$ = this.data$.pipe(
    map((msg) => JSON.parse(msg)),
    skip(3),
    filter(
      (msg) =>
        typeof msg === 'object' &&
        !Object.values(msg).includes('hb') &&
        msg[1][1] !== 0 &&
        msg[1][2] < 0, // ASK
    ),
    map((msg) => {
      const bookMessage: IBookMessageBitfinex = {
        price: msg[1][0],
        count: msg[1][1],
        amount: Math.abs(msg[1][2]),
      };
      return bookMessage;
    }),
    scan(this.accumulatorFunction, {
      sumPrice: 0,
      remainingAmount: this.initialAmount,
    }),
    takeWhile((acc) => acc.remainingAmount >= 0),
  );

  public filteredDataSell$ = this.data$.pipe(
    map((msg) => JSON.parse(msg)),
    skip(3),
    filter(
      (msg) =>
        typeof msg === 'object' &&
        !Object.values(msg).includes('hb') &&
        msg[1][1] !== 0 &&
        msg[1][2] > 0, // BID
    ),
    map((msg) => {
      const bookMessage: IBookMessageBitfinex = {
        price: msg[1][0],
        count: msg[1][1],
        amount: msg[1][2],
      };
      return bookMessage;
    }),
    scan(this.accumulatorFunction, {
      sumPrice: 0,
      remainingAmount: this.initialAmount,
    }),
    takeWhile((acc) => acc.remainingAmount >= 0),
  );

  constructor(
    private pair: Pairs,
    private initialAmount: number,
    private operation: Operations,
  ) {
    this.ws = new WebSocket(process.env.WSS_BITFINEX);
    this.ws.on('open', () => this.sendSubscriptionMessage());
    this.ws.on('message', (msg) => this.handleMessage(msg));
  }

  private sendSubscriptionMessage() {
    const msg = book(this.pair);
    this.ws.send(msg);
  }

  private handleMessage(msg: any) {
    this.data$.next(msg.toString());
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

  close() {
    this.ws.close();
    this.data$.complete();
  }
}
