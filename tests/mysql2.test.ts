import * as mysql from "mysql2/promise";
import { runBasicTests } from "@next-auth/adapter-test";
import SqlAdapter from "../src";
import buildMysql2Helpers from "../src/drivers/mysql2";
import { buildUnitOfWork } from "../src/db";
import dbTests from "./shared";

function getConnection() {
  return mysql.createConnection({
    host: "127.0.0.1",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE || "authjs_test",
  });
}

const mysqlHelpers = buildMysql2Helpers(getConnection);
const db = buildUnitOfWork(mysqlHelpers);

runBasicTests({
  adapter: SqlAdapter(mysqlHelpers),
  db: dbTests(db),
});

const config = { prefix: "auth_" };
const dbWithPrefix = buildUnitOfWork(mysqlHelpers, config);

runBasicTests({
  adapter: SqlAdapter(mysqlHelpers, config),
  db: dbTests(dbWithPrefix),
});
