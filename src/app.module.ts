import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TransactionModule } from './modules/trx/trx.module';
import { PgModule } from './database/pg/pg.module';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { PartnerTrxModule } from './modules/partner-trx/partner-trx.module';
import { TriggerCallbackModule } from './modules/trigger-callback/trigger-callback.module';
import { RabbitmqModule } from './messaging/rabbitmq.module';
import { CallbackModule } from './modules/callback/callback.module';
import { PartnerCallbackModule } from './modules/partner-callback/partner-callback.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    TransactionModule,
    PartnerTrxModule,
    PgModule,
    RabbitmqModule,
    CallbackModule,
    TriggerCallbackModule,
    PartnerCallbackModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
