import { Module } from '@nestjs/common';
import { PartnerCallbackController } from './partner-callback.controller';
import { PartnerCallbackService } from './partner-callback.service';
import { RedisModule } from 'src/database/redis/redis.module';

@Module({
  imports: [RedisModule],
  controllers: [PartnerCallbackController],
  providers: [PartnerCallbackService],
  exports: [PartnerCallbackService],
})
export class PartnerCallbackModule {}
