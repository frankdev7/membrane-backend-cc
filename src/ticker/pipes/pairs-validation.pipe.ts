import { PipeTransform, BadRequestException } from '@nestjs/common';
import { Pairs } from '../../utils/pairs.enum';

export class PairsValidationPipe implements PipeTransform {
  transform(data: any) {
    console.log(data.pair);
    if (!Object.values(Pairs).includes(data.pair)) {
      throw new BadRequestException('Invalid pair');
    }
    return data;
  }
}
