import { Module } from '@nestjs/common';
import { TickerGateway } from './ticker.gateway';
import { TickerController } from './ticker.controller';
import { TickerService } from './ticker.service';
import { BitfinexModule } from 'src/bitfinex/bitfinex.module';

@Module({
  imports: [BitfinexModule],
  providers: [TickerGateway, TickerService],
  controllers: [TickerController],
})
export class TickerModule {}
