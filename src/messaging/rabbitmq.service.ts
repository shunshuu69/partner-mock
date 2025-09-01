import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from 'src/config/configuration';
import * as amqplib from 'amqplib';

@Injectable()
export class RabbitmqService implements OnModuleInit, OnModuleDestroy {
  private connection?: amqplib.ChannelModel;
  private channel?: amqplib.Channel;
  private queueName: string;
  private delayQueues = new Map<number, string>();
  private delaySchedule: Record<number, number> = {
    2: 10_000,
    3: 30_000,
    4: 60_000,
    5: 300_000,
  };

  constructor(private readonly config: ConfigService<AppConfig>) {
    this.queueName = process.env.RABBITMQ_QUEUE || 'callback';
  }

  async onModuleInit() {
    const rabbitCfg = this.config.get<AppConfig['rabbitmq']>('rabbitmq');
    const url = rabbitCfg?.url;
    const queue = rabbitCfg?.queue;

    if (queue) this.queueName = queue;

    const amqpUrl =
      url || process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672';

    this.connection = await amqplib.connect(amqpUrl);
    this.channel = await this.connection.createChannel();
    await this.channel.assertQueue(this.queueName, { durable: true });
    // create delay queues for broker-managed retries
    for (const [attemptStr, ttl] of Object.entries(this.delaySchedule)) {
      const attempt = Number(attemptStr);
      const qName = `${this.queueName}.delay.${attempt}`;
      await this.channel.assertQueue(qName, {
        durable: true,
        arguments: {
          'x-dead-letter-exchange': '', // default exchange
          'x-dead-letter-routing-key': this.queueName, // route back to main
          'x-message-ttl': ttl,
        },
      });
      this.delayQueues.set(attempt, qName);
    }
    // fair dispatch
    await this.channel.prefetch(100);
  }

  publish(message: unknown) {
    if (!this.channel) throw new Error('RabbitMQ channel not initialized');

    const payload = Buffer.from(
      typeof message === 'string' ? message : JSON.stringify(message),
    );

    const ok = this.channel.sendToQueue(this.queueName, payload, {
      persistent: true,
      contentType: 'application/json',
    });

    return ok;
  }

  publishToDelay(message: unknown, attempt: number) {
    if (!this.channel) throw new Error('RabbitMQ channel not initialized');
    const qName = this.delayQueues.get(attempt);
    if (!qName)
      throw new Error(`No delay queue configured for attempt ${attempt}`);

    const payload = Buffer.from(
      typeof message === 'string' ? message : JSON.stringify(message),
    );

    const ok = this.channel.sendToQueue(qName, payload, {
      persistent: true,
      contentType: 'application/json',
    });

    return ok;
  }

  async consume(
    onMessage: (msg: amqplib.ConsumeMessage) => Promise<void> | void,
    options?: amqplib.Options.Consume,
  ) {
    if (!this.channel) throw new Error('RabbitMQ channel not initialized');
    await this.channel.consume(
      this.queueName,
      async (msg: amqplib.ConsumeMessage | null) => {
        if (!msg) return;
        try {
          await onMessage(msg);
          this.channel!.ack(msg);
        } catch {
          // do not requeue to avoid poison messages loop; adjust as needed
          this.channel!.nack(msg, false, false);
        }
      },
      { noAck: false, ...(options || {}) },
    );
  }

  async onModuleDestroy() {
    try {
      await this.channel?.close();
    } catch {
      /* ignore */
    }
    try {
      await this.connection?.close();
    } catch {
      /* ignore */
    }
  }
}
