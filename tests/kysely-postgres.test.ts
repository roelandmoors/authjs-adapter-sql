import { runBasicTests } from "@next-auth/adapter-test";
import SqlAdapter from "../src";
import buildKyselyHelpers from "../src/drivers/kysely";
import { buildUnitOfWork } from "../src/db";
import dbTests from "./shared";
import { Kysely, PostgresDialect } from "kysely";
import { Pool } from "pg";

const pool = new Pool({
  host: "localhost",
  database: "postgres",
  user: "postgres",
  password: "postgres",
});

const db = new Kysely({
  dialect: new PostgresDialect({
    pool,
  }),
});

const helpers = buildKyselyHelpers(db, "postgres");
const uow = buildUnitOfWork(helpers);

// Close pool after tests
let dbTestsWithDisconnect = {
  ...dbTests(uow),
  disconnect: async () => {
    await pool.end();
  },
};

runBasicTests({
  adapter: SqlAdapter(helpers),
  db: dbTestsWithDisconnect,
});
