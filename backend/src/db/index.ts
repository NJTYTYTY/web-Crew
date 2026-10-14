import dotenv from 'dotenv';
import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from './schema';

dotenv.config();

const connectionString =
  process.env.DATABASE_URL ||
  'postgresql://postgres:postgres@localhost:5432/nexusplay';

export const pool = new Pool({
  connectionString,
});

export const db = drizzle(pool, { schema });
export * from './schema';
