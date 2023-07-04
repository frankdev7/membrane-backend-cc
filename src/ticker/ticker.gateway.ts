import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
  WsResponse,
} from '@nestjs/websockets';
import { Server, WebSocket } from 'ws';
import { Observable, map } from 'rxjs';
import { ResponseTickerDto } from './dtos/response-ticker.dto';
import { ITickerMessage } from './dtos/ticker-message.dto';
import { Events } from 'src/utils/events-membrane.enum';
import { RequestTickerDto } from './dtos/request-ticker.dto';
import { Logger } from '@nestjs/common';
import { TickerBitFinexWebSocket } from 'src/bitfinex/websockets/ticker-bitfinex.websocket';

@WebSocketGateway(8080)
export class TickerGateway {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(TickerGateway.name);
  private clients: Map<WebSocket, TickerBitFinexWebSocket> = new Map();

  @SubscribeMessage(Events.TICKER)
  ticker(
    @ConnectedSocket() client: WebSocket,
    @MessageBody() data: RequestTickerDto,
  ): Observable<WsResponse<ResponseTickerDto>> {
    this.logger.log(`Received TICKER event ${JSON.stringify(data)}`);
    let tickerBitFinexWebSocket;
    try {
      tickerBitFinexWebSocket = new TickerBitFinexWebSocket(data.pair);
      this.logger.log(`Created TickerBitFinexWebSocket for pair ${data.pair}`);
    } catch (error) {
      this.logger.error('Error creating TickerBitFinexWebSocket:', error);
      throw error;
    }

    this.clients.set(client, tickerBitFinexWebSocket);
    this.logger.log('Client added to map');

    this.handleClientClose(client);

    return tickerBitFinexWebSocket.filteredData$.pipe(
      map(this.mapTickerMessage),
    );
  }

  private handleClientClose(client: WebSocket) {
    client.on('close', () => {
      this.logger.log(`Client closed connection`);
      const tickerWs = this.clients.get(client);
      if (tickerWs) {
        tickerWs.close();
        this.clients.delete(client);
        this.logger.log('Client removed from map');
      }
    });
  }

  private mapTickerMessage(tickerMsg: any): ITickerMessage {
    if (!tickerMsg.event) {
      const tickerData = tickerMsg[1];
      const response: ResponseTickerDto = {
        bidPrice: tickerData[0],
        bidAmount: tickerData[1],
        askPrice: tickerData[2],
        askAmount: tickerData[3],
      };
      return {
        event: Events.TICKER,
        data: response,
      };
    }
    return {
      event: Events.TICKER,
      data: tickerMsg,
    };
  }
}
