import { sql } from "@vercel/postgres";

import { runBasicTests } from "@next-auth/adapter-test";
import SqlAdapter from "../src";
import buildVercelHelpers from "../src/vercel";
import { buildUnitOfWork } from "../src/db";
import dbTests from "./shared";

async function getConnection() {
  return await sql.connect();
}

const vercelHelpers = buildVercelHelpers(getConnection);

const db = buildUnitOfWork(vercelHelpers);

runBasicTests({
  adapter: SqlAdapter(vercelHelpers),
  db: dbTests(db),
});
