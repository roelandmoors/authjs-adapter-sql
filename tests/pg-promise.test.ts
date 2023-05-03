import pgPromise from "pg-promise";
import { runBasicTests } from "@next-auth/adapter-test";
import SqlAdapter from "../src";
import buildPgPromiseHelpers from "../src/pg-promise";
import { buildUnitOfWork } from "../src/db";
import dbTests from "./shared";

const pgp = pgPromise();
const db = pgp("postgres://postgres:postgres@localhost:5432/postgres");

function getConnection() {
  return db;
}

const pgHelpers = buildPgPromiseHelpers(getConnection);
const uow = buildUnitOfWork(pgHelpers);

// Close pool after tests
let dbTestsWithDisconnect = {
  ...dbTests(uow),
  disconnect: async () => {
    await pgp.end();
  },
};

runBasicTests({
  adapter: SqlAdapter(pgHelpers),
  db: dbTestsWithDisconnect,
});
