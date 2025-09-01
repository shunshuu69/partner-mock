import { Injectable } from '@nestjs/common';
import { BaseRepository } from '../../base.repository';
import { TransactionInsertOne, TransactionRow } from './types';

@Injectable()
export class TrxRepository extends BaseRepository {
  private readonly TABLE: string = 'public.transaction';

  // async onModuleInit() {
  //   await this.exec(`CREATE TABLE IF NOT EXISTS ${this.TABLE} (
  //     id character varying(255) PRIMARY KEY NOT NULL,
  //     partner_id character varying(3) NOT NULL,
  //     merchant_id character varying(4) NOT NULL,
  //     amount numeric(15, 2) NULL,
  //     amount_currency character varying(3) NULL,
  //     partner_refference character varying(50) NOT NULL,
  //     paid_at timestamp with time zone NULL,
  //     is_paid boolean NULL DEFAULT false
  //   );`);
  // }

  // async onModuleDestroy() {
  //   await this.exec(`DELETE FROM ${this.TABLE}`);
  // }

  async createOne(data: TransactionInsertOne) {
    return await this.insertOne<TransactionRow, TransactionInsertOne>(
      this.TABLE,
      data,
      Object.keys(data) as (keyof TransactionInsertOne)[],
    );
  }

  async findMany(limit: number): Promise<TransactionRow[]> {
    const lim = Math.max(1, Math.min(10000, Number(limit || 1)));
    const res = await this.exec<TransactionRow>(
      `SELECT
        id,
        partner_id,
        merchant_id,
        amount,
        amount_currency,
        partner_refference,
        vendor_id,
        vendor_account_id,
        vendor_merchant_name,
        paid_at,
        is_paid
      FROM ${this.TABLE}
      WHERE is_paid = false
      LIMIT $1`,
      [lim],
    );
    return res.rows;
  }

  async findOne(limit: number): Promise<TransactionRow[]> {
    const lim = Math.max(1, Math.min(10000, Number(limit || 1)));
    const res = await this.exec<TransactionRow>(
      `SELECT
        id,
        partner_id,
        merchant_id,
        amount,
        amount_currency,
        partner_refference,
        vendor_id,
        vendor_account_id,
        vendor_merchant_name,
        paid_at,
        is_paid
      FROM ${this.TABLE}
      WHERE is_paid = false
      LIMIT $1`,
      [lim],
    );
    return res.rows;
  }

  async markPaid(id: string): Promise<TransactionRow | null> {
    const res = await this.exec<TransactionRow>(
      `UPDATE ${this.TABLE} SET is_paid = true, paid_at = NOW() WHERE id = $1 RETURNING id, partner_id, merchant_id, amount, amount_currency, partner_refference, paid_at, is_paid`,
      [id],
    );
    return res.rows?.[0] ?? null;
  }
}
