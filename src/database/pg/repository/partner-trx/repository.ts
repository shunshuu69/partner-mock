import { Injectable, OnModuleInit } from '@nestjs/common';
import { BaseRepository } from '../../base.repository';
import { PartnerTransactionInsertOne } from './types';

@Injectable()
export class PartnerTrxRepository
  extends BaseRepository
  implements OnModuleInit
{
  private readonly TABLE: string = 'public.partner_transaction';

  async onModuleInit() {
    await this.exec(`CREATE TABLE IF NOT EXISTS ${this.TABLE} (
      id VARCHAR(255) PRIMARY KEY NOT NULL,
      partner_id VARCHAR(3) NOT NULL,
      merchant_id VARCHAR(4) NOT NULL,
      amount NUMERIC(18, 2) NULL,
      amount_currency VARCHAR(3) NULL,
      paid_at TIMESTAMP WITH TIME ZONE NULL,
      is_paid BOOLEAN NULL DEFAULT false,
      created_at TIMESTAMPTZ NULL DEFAULT NOW()
    );`);
  }

  async createOne(data: PartnerTransactionInsertOne) {
    return await this.insertOne(
      this.TABLE,
      data,
      Object.keys(data) as (keyof PartnerTransactionInsertOne)[],
    );
  }

  async findById(id: string) {
    const res = await this.exec(
      `SELECT id, partner_id, merchant_id, amount, amount_currency, paid_at, is_paid FROM ${this.TABLE} WHERE id = $1 LIMIT 1`,
      [id],
    );
    return res.rows?.[0] ?? null;
  }

  async markPaid(id: string) {
    const res = await this.exec(
      `UPDATE ${this.TABLE} SET is_paid = true, paid_at = NOW() WHERE id = $1 RETURNING id, partner_id, merchant_id, amount, amount_currency, paid_at, is_paid`,
      [id],
    );
    return res.rows?.[0] ?? null;
  }
}
