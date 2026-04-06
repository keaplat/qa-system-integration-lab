import { Pool, type QueryResultRow } from 'pg';

const connectionString =
  process.env.DATABASE_URL ?? 'postgres://qa_user:qa_pass@127.0.0.1:5432/qa_integration_lab';

export class DatabaseClient {
  private readonly pool = new Pool({
    connectionString
  });

  async findOrderById(id: number) {
    const result = await this.pool.query<OrderRow>('SELECT * FROM orders WHERE id = $1', [id]);
    return result.rows[0];
  }

  async close(): Promise<void> {
    await this.pool.end();
  }
}

type OrderRow = QueryResultRow & {
  email: string;
  id: number;
  product_name: string;
  quantity: number;
  status: string;
  total: number;
};
