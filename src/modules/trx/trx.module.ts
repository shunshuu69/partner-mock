import { Module } from '@nestjs/common';
import { TransactionController } from './trx.controller';
import { TransactionService } from './trx.service';

@Module({
  imports: [],
  controllers: [TransactionController],
  providers: [TransactionService],
})
export class TransactionModule {}
