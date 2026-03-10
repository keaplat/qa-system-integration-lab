import { readFileSync } from 'node:fs';
import path from 'node:path';

import { Pool, type QueryResultRow } from 'pg';

const connectionString =
  process.env.DATABASE_URL ?? 'postgres://qa_user:qa_pass@127.0.0.1:5432/qa_integration_lab';

export const pool = new Pool({
  connectionString
});

export async function initializeDatabase(): Promise<void> {
  const schemaPath = path.resolve(process.cwd(), 'src/app/schema.sql');
  const schema = readFileSync(schemaPath, 'utf-8');

  await retry(async () => {
    await pool.query(schema);
  }, 20, 1_500);
}

export async function query<T extends QueryResultRow>(text: string, values: unknown[] = []): Promise<T[]> {
  const result = await pool.query<T>(text, values);
  return result.rows;
}

async function retry<T>(task: () => Promise<T>, retries: number, delayMs: number): Promise<T> {
  let lastError: unknown;

  for (let attempt = 1; attempt <= retries; attempt += 1) {
    try {
      return await task();
    } catch (error) {
      lastError = error;
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }

  throw lastError;
}
