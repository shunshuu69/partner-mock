import { Module } from '@nestjs/common';
import { PartnerTrxController } from './partner-trx.controller';
import { PartnerTrxService } from './partner-trx.service';
import { PgModule } from 'src/database/pg/pg.module';

@Module({
  imports: [PgModule],
  controllers: [PartnerTrxController],
  providers: [PartnerTrxService],
})
export class PartnerTrxModule {}
