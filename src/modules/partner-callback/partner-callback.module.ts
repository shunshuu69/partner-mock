import { Module } from '@nestjs/common';
import { PartnerCallbackController } from './partner-callback.controller';
import { PartnerCallbackService } from './partner-callback.service';
import { PgModule } from 'src/database/pg/pg.module';

@Module({
  imports: [PgModule],
  controllers: [PartnerCallbackController],
  providers: [PartnerCallbackService],
  exports: [PartnerCallbackService],
})
export class PartnerCallbackModule {}
