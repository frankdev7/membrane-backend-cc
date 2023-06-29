import { Pairs } from '../enums/pairs.enum';

export class ResponseTickerDto {
  pair: Pairs;
  bidAmount: string;
  bidPrice: string;
  askAmount: string;
  askPrice: string;
}
