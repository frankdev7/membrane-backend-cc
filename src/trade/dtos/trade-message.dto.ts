import { ResponseTradeDto } from './response-trade.dto';

export interface ITradeMessage {
  event: string;
  data: ResponseTradeDto;
}
