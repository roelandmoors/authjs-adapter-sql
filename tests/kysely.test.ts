import { runBasicTests } from "@next-auth/adapter-test";
import SqlAdapter from "../src";
import builKyselyHelpers from "../src/drivers/kysely";
import { buildUnitOfWork } from "../src/db";
import dbTests from "./shared";
import { Kysely, MysqlDialect } from "kysely";
import * as mysql from "mysql2";

function getConnection() {
  const db = new Kysely({
    dialect: new MysqlDialect({
      pool: mysql.createPool({
        host: "127.0.0.1",
        user: process.env.DB_USER || "root",
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE || "authjs_test",
      }),
    }),
  });
  return db;
}

const helpers = builKyselyHelpers(getConnection);
const db = buildUnitOfWork(helpers);

runBasicTests({
  adapter: SqlAdapter(helpers),
  db: dbTests(db),
});
