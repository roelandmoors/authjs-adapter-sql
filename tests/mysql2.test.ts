import * as mysql from "mysql2/promise";
import { runBasicTests } from "@next-auth/adapter-test";
import SqlAdapter from "../src";
import buildMysql2Helpers from "../src/drivers/mysql2";
import { buildUnitOfWork } from "../src/db";
import dbTests from "./shared";

let pool = mysql.createPool({
  host: "127.0.0.1",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE || "authjs_test",
});

const sqltag = buildMysql2Helpers(pool.getConnection);
const db = buildUnitOfWork(sqltag);

runBasicTests({
  adapter: SqlAdapter(sqltag),
  db: dbTests(db),
});

const config = { prefix: "auth_" };
const dbWithPrefix = buildUnitOfWork(sqltag, config);

runBasicTests({
  adapter: SqlAdapter(sqltag, config),
  db: dbTests(dbWithPrefix),
});
