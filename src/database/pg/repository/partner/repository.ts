import { Injectable } from '@nestjs/common';
import { BaseRepository } from '../../base.repository';

@Injectable()
export class PartnerRepository extends BaseRepository {
  private readonly TABLE: string = 'public.partner';

  // async onModuleInit() {
  //   await this.exec(`CREATE TABLE IF NOT EXISTS ${this.TABLE} (
  //     id VARCHAR(3) PRIMARY KEY NOT NULL,
  //     name VARCHAR(50) NULL
  //   );`);

  //   for (let i = 1; i <= 10; i++) {
  //     try {
  //       const id = `A${String(i).padStart(2, '0')}`;
  //       await this.insertOne(this.TABLE, {
  //         id,
  //         name: `Partner ${id}`,
  //       });
  //       // eslint-disable-next-line @typescript-eslint/no-unused-vars
  //     } catch (_error) {
  //       // console.log(_error);
  //       continue;
  //     }
  //   }
  // }

  async findAll() {
    const res = await this.exec(`SELECT * FROM ${this.TABLE}`);
    return res.rows;
  }
}
