import { Operations } from 'src/utils/operations.enum';
import { Pairs } from 'src/utils/pairs.enum';

export interface RequestBookBitfinexDto {
  pair: Pairs;
  amount: number;
  operation: Operations;
  len: number;
}
