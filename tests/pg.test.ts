import { Pool } from "pg";
import { runBasicTests } from "@next-auth/adapter-test";
import SqlAdapter from "../src";
import buildPgHelpers from "../src/drivers/pg";
import { buildUnitOfWork } from "../src/db";
import dbTests from "./shared";

const pool = new Pool({
  connectionString: "postgres://postgres:postgres@localhost:5432/postgres",
});

function getConnection() {
  return pool.connect();
}

const pgHelpers = buildPgHelpers(getConnection);
const uow = buildUnitOfWork(pgHelpers);

// Close pool after tests
let dbTestsWithDisconnect = {
  ...dbTests(uow),
  disconnect: async () => {
    await pool.end();
  },
};

runBasicTests({
  adapter: SqlAdapter(pgHelpers),
  db: dbTestsWithDisconnect,
});
