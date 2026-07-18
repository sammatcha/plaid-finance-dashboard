import { Kysely, PostgresDialect } from "kysely";
import { Pool } from "pg";

// No tables defined yet — this will grow as the schema is built out.
interface Database {}

const dialect = new PostgresDialect({
  pool: new Pool({
    connectionString: process.env.DATABASE_URL,
  }),
});

export const db = new Kysely<Database>({
  dialect,
});
