import { Module } from '@nestjs/common';
import { TradeGateway } from './trade.gateway';

@Module({
  providers: [TradeGateway],
})
export class TradeModule {}
