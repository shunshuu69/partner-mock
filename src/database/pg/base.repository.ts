import { Inject } from '@nestjs/common';
import { Pool, PoolClient, QueryResult, QueryResultRow } from 'pg';
import { PG_POOL } from './pg.constants';

export abstract class BaseRepository {
  constructor(@Inject(PG_POOL) protected readonly pool: Pool) {}

  /**
   * Runs the provided function within a SQL transaction using a dedicated client.
   * Commits on success, rolls back on error, and always releases the client.
   */
  protected async withTransaction<T>(
    fn: (client: PoolClient) => Promise<T>,
  ): Promise<T> {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      const result = await fn(client);
      await client.query('COMMIT');
      return result;
    } catch (err) {
      try {
        await client.query('ROLLBACK');
      } catch {
        // ignore rollback errors
      }
      throw err;
    } finally {
      client.release();
    }
  }

  /** Executes a query using either the provided transaction client or the pool. */
  protected async exec<T extends QueryResultRow = QueryResultRow>(
    sql: string,
    params: unknown[] = [],
    client?: PoolClient,
  ): Promise<QueryResult<T>> {
    if (client) return client.query<T>(sql, params);
    return this.pool.query<T>(sql, params);
  }
  /** Validate identifier (table/column) to avoid SQL injection via identifiers. */
  private assertSafeIdentifier(id: string) {
    if (!/^[a-zA-Z_][a-zA-Z0-9_.]*$/.test(id)) {
      throw new Error(`Unsafe SQL identifier: ${id}`);
    }
  }

  /** Build an INSERT statement dynamically from provided data. */
  protected buildInsertStatement<T extends Record<string, unknown>>(
    table: string,
    data: Partial<T>,
    allowed?: readonly (keyof T)[],
  ): { sql: string; params: unknown[] } {
    this.assertSafeIdentifier(table);
    const entries: [string, unknown][] = [];
    if (allowed && allowed.length > 0) {
      for (const key of allowed) {
        const v = data[key];
        if (v !== undefined) {
          const col = String(key);
          this.assertSafeIdentifier(col);
          entries.push([col, v]);
        }
      }
    } else {
      for (const key of Object.keys(data) as (keyof T)[]) {
        const v = data[key];
        if (v !== undefined) {
          const col = String(key);
          this.assertSafeIdentifier(col);
          entries.push([col, v]);
        }
      }
    }
    if (entries.length === 0) {
      throw new Error('buildInsertStatement: no columns to insert');
    }
    const columns = entries.map(([k]) => k).join(', ');
    const placeholders = entries.map((_, i) => `$${i + 1}`).join(', ');
    const sql = `INSERT INTO ${table} (${columns}) VALUES (${placeholders}) RETURNING *`;
    const params = entries.map(([, v]) => v);
    return { sql, params };
  }

  /** Execute dynamic INSERT built from `data`. Optionally within a transaction client. */
  protected async insertOne<
    T extends QueryResultRow = QueryResultRow,
    D extends Record<string, unknown> = Record<string, unknown>,
  >(
    table: string,
    data: Partial<D>,
    allowed?: readonly (keyof D)[],
    client?: PoolClient,
  ): Promise<QueryResult<T>> {
    const { sql, params } = this.buildInsertStatement<D>(table, data, allowed);
    return this.exec<T>(sql, params, client);
  }
}
