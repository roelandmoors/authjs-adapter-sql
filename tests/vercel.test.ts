require("dotenv").config();
import { runBasicTests } from "@next-auth/adapter-test";
import SqlAdapter from "../src";
import { buildUnitOfWork } from "../src/db";
import buildVercelHelpers from "../src/drivers/vercel";
import dbTests from "./shared";
import ws from "ws";
import { createPool } from "@vercel/postgres";
import { neonConfig, Pool } from "@neondatabase/serverless";
neonConfig.webSocketConstructor = ws;

// Need to customize your config?:
const pool = createPool({
  /* config */
});

const helpers = buildVercelHelpers(pool);
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
