import pgPromise from "pg-promise";

import { runBasicTests } from "@next-auth/adapter-test";
import SqlAdapter from "../src";
import buildPgPromiseHelpers from "../src/pg-promise";
import { buildUnitOfWork } from "../src/db";
import dbTests from "./shared";

const pgp = pgPromise({
  /* Initialization Options */
});
const db = pgp("postgres://postgres@localhost:5432/postgres");

function getConnection() {
  return db;
}

const mysqlHelpers = buildPgPromiseHelpers(getConnection);

const uow = buildUnitOfWork(mysqlHelpers);

runBasicTests({
  adapter: SqlAdapter(mysqlHelpers),
  db: dbTests(uow),
});
