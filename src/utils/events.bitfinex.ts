import { Pairs } from './pairs.enum';

export const tiker = (pair: Pairs) =>
  JSON.stringify({
    event: 'subscribe',
    channel: 'ticker',
    symbol: pair,
  });

export const book = (pair: Pairs) =>
  JSON.stringify({
    event: 'subscribe',
    channel: 'book',
    symbol: pair,
  });
