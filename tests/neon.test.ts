require("dotenv").config();
import { runBasicTests } from "@next-auth/adapter-test";
import SqlAdapter from "../src";
import { buildUnitOfWork } from "../src/db";
import buildNeonHelpers from "../src/drivers/neon";
import dbTests from "./shared";
import ws from "ws";
import { neonConfig, Pool } from "@neondatabase/serverless";
neonConfig.webSocketConstructor = ws;

const pool = new Pool({ connectionString: process.env.NEON_URL });

const helpers = buildNeonHelpers(pool);
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
