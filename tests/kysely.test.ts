import { runBasicTests } from "@next-auth/adapter-test";
import SqlAdapter from "../src";
import builKyselyHelpers from "../src/drivers/kysely";
import { buildUnitOfWork } from "../src/db";
import dbTests from "./shared";
import { Kysely, MysqlDialect } from "kysely";
import * as mysql from "mysql2";

const pool = mysql.createPool({
  host: "127.0.0.1",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE || "authjs_test",
});

function getConnection() {
  const db = new Kysely({
    dialect: new MysqlDialect({
      pool,
    }),
  });
  return db;
}

const helpers = builKyselyHelpers(getConnection);
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
