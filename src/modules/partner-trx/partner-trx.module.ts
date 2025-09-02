import { Module } from '@nestjs/common';
import { PartnerTrxController } from './partner-trx.controller';

@Module({
  imports: [],
  controllers: [PartnerTrxController],
  providers: [],
})
export class PartnerTrxModule {}
