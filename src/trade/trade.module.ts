import { Module } from '@nestjs/common';
import { TradeGateway } from './trade.gateway';
import { TradeController } from './trade.controller';
import { TradeService } from './trade.service';
import { BitfinexModule } from 'src/bitfinex/bitfinex.module';

@Module({
  imports: [BitfinexModule],
  providers: [TradeGateway, TradeService],
  controllers: [TradeController],
})
export class TradeModule {}
