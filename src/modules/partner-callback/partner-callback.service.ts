import { Injectable } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class PartnerCallbackService {
  constructor(@Inject('REDIS') private readonly redis: Redis) {}

  async handle(body: any) {
    // add counter to redis
    const counter = await this.redis.incr('partner-received');

    return;
  }

  async getCounter(): Promise<number> {
    const value = await this.redis.get('partner-received');
    return Number(value ?? 0);
  }

  async resetCounter(): Promise<number> {
    await this.redis.set('partner-received', 0);
    const value = await this.redis.get('partner-received');
    return Number(value ?? 0);
  }
}
