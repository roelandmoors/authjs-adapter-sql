import pgPromise from "pg-promise";
import { runBasicTests } from "@next-auth/adapter-test";
import SqlAdapter from "../src";
import buildPgPromiseHelpers from "../src/drivers/pg-promise";
import { buildUnitOfWork } from "../src/db";
import dbTests from "./shared";

const pgp = pgPromise();
const db = pgp("postgres://postgres:postgres@localhost:5432/postgres");

function getConnection() {
  return db;
}

const config = { prefix: "auth." };

const pgHelpers = buildPgPromiseHelpers(getConnection);
const uow = buildUnitOfWork(pgHelpers, config);

// Close pool after tests
let dbTestsWithDisconnect = {
  ...dbTests(uow),
  disconnect: async () => {
    await pgp.end();
  },
};

runBasicTests({
  adapter: SqlAdapter(pgHelpers, config),
  db: dbTestsWithDisconnect,
});
