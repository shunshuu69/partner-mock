import { Injectable } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class PartnerCallbackService {
  constructor(@Inject('REDIS') private readonly redis: Redis) {}

  async handle(body: any) {
    // add counter to redis
    const counter = await this.redis.incr('counter');

    return;
  }

  async getCounter(): Promise<number> {
    const value = await this.redis.get('counter');
    return Number(value ?? 0);
  }
}
