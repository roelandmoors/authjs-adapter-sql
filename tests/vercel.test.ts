require("dotenv").config();
import { runBasicTests } from "@next-auth/adapter-test";
import SqlAdapter from "../src";
import { buildUnitOfWork } from "../src/db";
import buildVercelHelpers from "../src/drivers/vercel";
import dbTests from "./shared";
import { createPool } from "@vercel/postgres";

// Needed for getting it to work in Jest
import ws from "ws";
import { neonConfig } from "@neondatabase/serverless";
neonConfig.webSocketConstructor = ws;

const pool = createPool();

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
