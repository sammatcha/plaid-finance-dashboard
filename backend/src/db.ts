import { Kysely, PostgresDialect , Generated } from "kysely";
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

const dialect = new PostgresDialect({
  pool: new Pool({
    connectionString: process.env.DATABASE_URL,
  }),
});

export const db = new Kysely<Database>({
  dialect,
});
