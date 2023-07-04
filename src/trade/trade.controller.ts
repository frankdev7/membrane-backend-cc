import { Body, Controller, Post } from '@nestjs/common';
import { TradeService } from './trade.service';
import { RequestTradeDto } from './dtos/request-trade.dto';

@Controller('trade')
export class TradeController {
  constructor(private readonly tradeService: TradeService) {}

  @Post()
  trade(@Body() requestTradeDto: RequestTradeDto) {
    return this.tradeService.trade(requestTradeDto);
  }
}
