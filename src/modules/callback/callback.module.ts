import { Module } from '@nestjs/common';
import { RabbitmqModule } from 'src/messaging/rabbitmq.module';
import { CallbackService } from './callback.service';
import { CallbackConsumer } from './callback.consumer';
import { CallbackController } from './callback.controller';

@Module({
  imports: [RabbitmqModule],
  controllers: [CallbackController],
  providers: [CallbackService, CallbackConsumer],
  exports: [CallbackService],
})
export class CallbackModule {}
