import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
  WsResponse,
} from '@nestjs/websockets';
import { Server, WebSocket } from 'ws';
import { TickerBitFinexWebSocket } from './ticker-bitfinex.websocket';
import { Observable, map } from 'rxjs';

@WebSocketGateway()
export class TickerGateway {
  @WebSocketServer()
  server: Server;

  private clients: Map<WebSocket, TickerBitFinexWebSocket> = new Map();

  @SubscribeMessage('ticker')
  ticker(
    @ConnectedSocket() client: WebSocket,
    @MessageBody() data: string,
  ): Observable<WsResponse<any>> {
    console.log(data);
    const tickerBitFinexWebSocket = new TickerBitFinexWebSocket(data);
    this.clients.set(client, tickerBitFinexWebSocket);

    client.on('close', () => {
      const tickerWs = this.clients.get(client);
      if (tickerWs) {
        tickerWs.close();
        this.clients.delete(client);
      }
    });

    return tickerBitFinexWebSocket.filteredData$.pipe(
      map((msg) => ({ event: 'ticker', data: msg })),
    );
  }
}
