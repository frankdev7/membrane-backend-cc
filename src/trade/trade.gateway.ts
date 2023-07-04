import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
  WsResponse,
} from '@nestjs/websockets';
import { RequestTradeDto } from './dtos/request-trade.dto';
import { Server, WebSocket } from 'ws';
import { Logger } from '@nestjs/common';
import { BookBitFinexWebSocket } from './book-bitfinex.websocket';
import { Observable, map } from 'rxjs';
import { ResponseTradeDto } from './dtos/response-trade.dto';
import { Events } from 'src/utils/events-membrane.enum';
import { ITradeMessage } from './dtos/trade-message.dto';
import { IBookMessageMembrane } from './dtos/book-membrane.dto';
import { Operations } from 'src/utils/operations.enum';

@WebSocketGateway()
export class TradeGateway {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(TradeGateway.name);
  private clients: Map<WebSocket, BookBitFinexWebSocket> = new Map();

  @SubscribeMessage('trade')
  trade(
    @ConnectedSocket() client: WebSocket,
    @MessageBody() data: RequestTradeDto,
  ): Observable<WsResponse<ResponseTradeDto>> {
    this.logger.log(`Received TRADE event ${JSON.stringify(data)}`);
    let bookBitFinexWebSocket;
    try {
      bookBitFinexWebSocket = new BookBitFinexWebSocket(
        data.pair,
        data.amount,
        data.operation,
      );
      this.logger.log(`Created BookBitFinexWebSocket for pair ${data.pair}`);
    } catch (error) {
      this.logger.error('Error creating BookBitFinexWebSocket:', error);
      throw error;
    }

    this.clients.set(client, bookBitFinexWebSocket);
    this.logger.log('Client added to map');

    this.handleClientClose(client);

    if (data.operation === Operations.SELL) {
      return bookBitFinexWebSocket.filteredDataSell$.pipe(
        map(this.mapTradeMessage),
      );
    } else if (Operations.BUY === data.operation) {
      return bookBitFinexWebSocket.filteredDataBuy$.pipe(
        map(this.mapTradeMessage),
      );
    }
  }

  private mapTradeMessage(bookMsg: IBookMessageMembrane): ITradeMessage {
    return {
      event: Events.TRADE,
      data: {
        price: bookMsg.sumPrice,
      },
    };
  }

  private handleClientClose(client: WebSocket) {
    client.on('close', () => {
      this.logger.log(`Client closed connection`);
      const traderWs = this.clients.get(client);
      if (traderWs) {
        traderWs.close();
        this.clients.delete(client);
        this.logger.log('Client removed from map');
      }
    });
  }
}
