import { ResponseTickerDto } from './response-ticker.dto';

export interface ITickerMessage {
  event: string;
  data: ResponseTickerDto;
}
