import { Module, OnModuleDestroy } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PG_POOL } from './pg.constants';
import { AppConfig } from '../../config/configuration';
import { Pool, PoolConfig } from 'pg';
import { PartnerTrxRepository } from './repository/partner-trx/repository';
import { PartnerRepository } from './repository/partner/repository';
import { MerchantRepository } from './repository/merchant/repository';
import { TrxRepository } from './repository/trx/repository';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: PG_POOL,
      inject: [ConfigService],
      useFactory: async (config: ConfigService<AppConfig>): Promise<Pool> => {
        const poolConfig: PoolConfig = {
          host: config.getOrThrow('database.pg.host', { infer: true }),
          port: config.getOrThrow('database.pg.port', { infer: true }),
          user: config.getOrThrow('database.pg.user', { infer: true }),
          password: config.getOrThrow('database.pg.password', { infer: true }),
          database: config.getOrThrow('database.pg.database', { infer: true }),
        };

        const pool = new Pool(poolConfig);

        console.log((await pool.query('SELECT 1')).rows);

        return pool;
      },
    },
    PartnerTrxRepository,
    PartnerRepository,
    MerchantRepository,
    TrxRepository,
  ],
  exports: [
    PG_POOL,
    PartnerTrxRepository,
    PartnerRepository,
    MerchantRepository,
    TrxRepository,
  ],
})
export class PgModule implements OnModuleDestroy {
  constructor(private readonly config: ConfigService<AppConfig>) {}
  async onModuleDestroy() {
    // Cleanup if needed
  }
}
