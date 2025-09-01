import { Controller } from '@nestjs/common';
import { TransactionService } from './trx.service';

@Controller('trx')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}
}
