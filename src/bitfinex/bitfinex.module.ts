import { Module } from '@nestjs/common';
import { BookBitfinexService } from './book-bitfinex.service';
import { TickerBitfinexService } from './ticker-bitfinex.service';

@Module({
  providers: [BookBitfinexService, TickerBitfinexService],
  exports: [BookBitfinexService, TickerBitfinexService],
})
export class BitfinexModule {}
