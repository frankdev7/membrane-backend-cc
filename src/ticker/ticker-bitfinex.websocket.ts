import { WebSocket } from 'ws';
import { Subject, filter, map } from 'rxjs';

export class TickerBitFinexWebSocket {
  private ws: WebSocket;
  public data$ = new Subject<any>();
  public filteredData$ = this.data$.pipe(
    map((msg) => JSON.parse(msg)),
    filter(
      (msg) => typeof msg === 'object' && !Object.values(msg).includes('hb'),
    ),
  );

  constructor(private pair: string) {
    this.ws = new WebSocket('wss://api-pub.bitfinex.com/ws/2');
    this.ws.on('open', () => this.sendSubscriptionMessage());
    this.ws.on('message', (msg) => this.handleMessage(msg));
  }

  private sendSubscriptionMessage() {
    const msg = JSON.stringify({
      event: 'subscribe',
      channel: 'ticker',
      symbol: this.pair,
    });
    this.ws.send(msg);
  }

  private handleMessage(msg: any) {
    console.log(msg.toString());
    this.data$.next(msg.toString());
  }

  close() {
    this.ws.close();
    this.data$.complete();
  }
}
