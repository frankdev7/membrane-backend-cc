import { Pairs } from 'src/ticker/enums/pairs.enum';
import { Events } from './events-membrane.enum';

export const tiker = (pair: Pairs) =>
  JSON.stringify({
    event: 'subscribe',
    channel: Events.TICKER,
    symbol: pair,
  });
