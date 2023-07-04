import { Operations } from 'src/utils/operations.enum';
import { Pairs } from 'src/utils/pairs.enum';

export interface RequestTradeDto {
  pair: Pairs;
  operation: Operations;
  amount: number;
}
