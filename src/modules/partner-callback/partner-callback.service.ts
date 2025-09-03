import { Injectable } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class PartnerCallbackService {
  constructor(@Inject('REDIS') private readonly redis: Redis) {}

  async handle(body: unknown) {
    // reference body to avoid unused param lint
    void body;
    // Determine partner code from environment variable
    const envCode = (process.env.PARTNER ?? '').toUpperCase();
    const valid = ['A', 'B', 'C', 'D'] as const;
    type PartnerLetter = (typeof valid)[number];
    const isPartnerLetter = (x: string): x is PartnerLetter =>
      (valid as readonly string[]).includes(x);

    const partnerCode: PartnerLetter | 'unknown' = isPartnerLetter(envCode)
      ? envCode
      : 'unknown';

    // Increment per-partner counter
    await this.redis.incr(`partner-received:${partnerCode}`);
    return;
  }

  async getCounter(): Promise<Record<string, number>> {
    const codes = ['A', 'B', 'C', 'D', 'unknown'] as const;
    const keys = codes.map((c) => `partner-received:${c}`);
    const values = await this.redis.mget(...keys);
    const result: Record<string, number> = {};
    let total = 0;
    values.forEach((v, i) => {
      const n = Number(v ?? 0);
      result[codes[i]] = n;
      total += n;
    });
    result.total = total;
    return result;
  }

  async resetCounter(): Promise<Record<string, number>> {
    const codes = ['A', 'B', 'C', 'D', 'unknown'] as const;
    for (const c of codes) {
      await this.redis.set(`partner-received:${c}`, 0);
    }
    const keys = codes.map((c) => `partner-received:${c}`);
    const values = await this.redis.mget(...keys);
    const result: Record<string, number> = {};
    let total = 0;
    values.forEach((v, i) => {
      const n = Number(v ?? 0);
      result[codes[i]] = n;
      total += n;
    });
    result.total = total;
    return result;
  }
}
