import { WebSocket } from 'ws';
import { Subject, filter, map } from 'rxjs';
import { tiker } from 'src/utils/events.bitfinex';
import { Pairs } from './enums/pairs.enum';

export class TickerBitFinexWebSocket {
  private ws: WebSocket;
  public data$ = new Subject<any>();
  public filteredData$ = this.data$.pipe(
    map((msg) => JSON.parse(msg)),
    filter((msg) => {
      return typeof msg === 'object' && !Object.values(msg).includes('hb');
    }),
  );

  constructor(private pair: Pairs) {
    this.ws = new WebSocket(process.env.WSS_BITFINEX_TICKER);
    this.ws.on('open', () => this.sendSubscriptionMessage());
    this.ws.on('message', (msg) => this.handleMessage(msg));
  }

  private sendSubscriptionMessage() {
    const msg = tiker(this.pair);
    this.ws.send(msg);
  }

  private handleMessage(msg: any) {
    this.data$.next(msg.toString());
  }

  close() {
    this.ws.close();
    this.data$.complete();
  }
}
