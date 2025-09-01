import { Injectable, Logger } from '@nestjs/common';
import { RabbitmqService } from 'src/messaging/rabbitmq.service';
import { CallbackService } from './callback.service';

@Injectable()
export class CallbackConsumer {
  private readonly logger = new Logger(CallbackConsumer.name);

  constructor(
    private readonly rabbit: RabbitmqService,
    private readonly callbackService: CallbackService,
  ) {}

  // async onModuleInit() {
  //   await this.rabbit.consume(async (msg) => {
  //     const text = msg.content.toString('utf8');
  //     let payload: any = text;
  //     try {
  //       payload = JSON.parse(text);
  //     } catch {
  //       // leave as text
  //     }

  //     const attempt = Number(payload?._meta?.attempt ?? 1);
  //     this.logger.log(`Consumed message (attempt ${attempt}): ${text}`);

  //     try {
  //       await this.callbackService.processMessage(payload);
  //       this.logger.log(`Processed successfully on attempt ${attempt}`);
  //     } catch (err) {
  //       const nextAttempt = attempt + 1;
  //       if (nextAttempt > 5) {
  //         this.logger.error('Max attempts reached (5). Dropping message.');
  //         return; // ack handled by wrapper
  //       }

  //       const republishPayload = {
  //         ...(payload || {}),
  //         _meta: { attempt: nextAttempt },
  //       };

  //       try {
  //         this.rabbit.publishToDelay(republishPayload, nextAttempt);
  //         this.logger.warn(`Scheduled retry #${nextAttempt} via delay queue`);
  //       } catch (e) {
  //         this.logger.error(`Failed to schedule retry #${nextAttempt}: ${e}`);
  //       }
  //     }
  //   });
  // }
}
