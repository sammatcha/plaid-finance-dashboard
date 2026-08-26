import { Kysely, PostgresDialect, Generated, sql } from "kysely";
import { Pool } from "pg";

// tables defined here
interface PlaidItemsTable {
  id: Generated<number>;
  user_id: string;
  access_token: string;
  item_id:string;
  created_at: Generated<Date>;

}
interface BudgetTable {
  id: Generated<number>,
	category: string,
	amount: number,
	month: string,
	created_at: Generated<Date>
}
interface Database {
  plaid_items: PlaidItemsTable;
  budget: BudgetTable
}

const connectionString = process.env.DATABASE_URL;
const needsSsl = Boolean(connectionString?.includes("render.com"));

const dialect = new PostgresDialect({
  pool: new Pool({
    connectionString,
    ssl: needsSsl ? { rejectUnauthorized: false } : undefined,
  }),
});

export const db = new Kysely<Database>({
  dialect,
});

export async function ensureSchema() {
  await sql`
    CREATE TABLE IF NOT EXISTS plaid_items (
      id SERIAL PRIMARY KEY,
      user_id TEXT NOT NULL,
      access_token TEXT NOT NULL,
      item_id TEXT NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT now()
    )
  `.execute(db);

  await sql`
    CREATE TABLE IF NOT EXISTS budget (
      id SERIAL PRIMARY KEY,
      category TEXT NOT NULL,
      amount NUMERIC(10, 2) NOT NULL,
      month DATE NOT NULL,
      created_at TIMESTAMPTZ DEFAULT now()
    )
  `.execute(db);
}
