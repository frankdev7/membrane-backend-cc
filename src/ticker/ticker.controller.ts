import { Body, Controller, Post } from '@nestjs/common';
import { TickerService } from './ticker.service';
import { RequestTickerDto } from './dtos/request-ticker.dto';

@Controller('ticker')
export class TickerController {
  constructor(private readonly tickerService: TickerService) {}

  @Post()
  trade(@Body() requestTickerDto: RequestTickerDto) {
    return this.tickerService.trade(requestTickerDto);
  }
}
