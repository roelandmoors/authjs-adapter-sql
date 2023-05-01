require("dotenv").config();
import { createPool } from "@vercel/postgres";

import { runBasicTests } from "@next-auth/adapter-test";
import SqlAdapter from "../src";
import buildVercelHelpers from "../src/vercel";
import { buildUnitOfWork } from "../src/db";
import dbTests from "./shared";

function getConnection() {
  return createPool();
}

const vercelHelpers = buildVercelHelpers(getConnection);

const db = buildUnitOfWork(vercelHelpers);

runBasicTests({
  adapter: SqlAdapter(vercelHelpers),
  db: dbTests(db),
});
