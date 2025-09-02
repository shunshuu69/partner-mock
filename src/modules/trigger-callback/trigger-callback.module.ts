import { Module } from '@nestjs/common';
import { TriggerCallbackController } from './trigger-callback.controller';
// import { TriggerCallbackService } from './trigger-callback.service';
// import { CallbackModule } from 'src/modules/callback/callback.module';
// import { PgModule } from 'src/database/pg/pg.module';

@Module({
  imports: [],
  controllers: [TriggerCallbackController],
  providers: [],
  exports: [],
})
export class TriggerCallbackModule {}
