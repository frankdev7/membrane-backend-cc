import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TickerModule } from './ticker/ticker.module';
import { ConfigModule } from '@nestjs/config';
import { TradeModule } from './trade/trade.module';
import { BitfinexModule } from './bitfinex/bitfinex.module';

@Module({
  imports: [ConfigModule.forRoot(), TickerModule, TradeModule, BitfinexModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
