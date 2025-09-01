import { Injectable } from '@nestjs/common';
import { BaseRepository } from '../../base.repository';
import { MerchantRow } from './types';

@Injectable()
export class MerchantRepository extends BaseRepository {
  private readonly TABLE: string = 'public.merchant';

  // async onModuleInit() {
  //   await this.exec(`CREATE TABLE IF NOT EXISTS ${this.TABLE} (
  //     id VARCHAR(4) PRIMARY KEY NOT NULL,
  //     name VARCHAR(50) NULL,
  //     partner_id VARCHAR(3) NULL
  //   );`);

  //   const check = await this.exec(`SELECT * FROM ${this.TABLE}`);
  //   if (check.rows.length > 0) return;

  //   for (let i = 1; i <= 10; i++) {
  //     for (let j = 1; j <= 2; j++) {
  //       const id = `A${Math.floor(Math.random() * 999)
  //         .toString()
  //         .padStart(3, '0')}`;
  //       await this.insertOne(this.TABLE, {
  //         id,
  //         name: `Merchant ${i}`,
  //         partner_id: `A${String(i).padStart(2, '0')}`,
  //       });
  //     }
  //   }
  // }

  async findAll() {
    const res = await this.exec<MerchantRow[]>(`SELECT * FROM ${this.TABLE}`);
    return res.rows;
  }

  async findOne(merchant_id: string) {
    const res = await this.exec<MerchantRow>(
      `
        SELECT * FROM ${this.TABLE} WHERE id = $1
        LIMIT 1
      `,
      [merchant_id],
    );
    return res.rows[0];
  }
}
