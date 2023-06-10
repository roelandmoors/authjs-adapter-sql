import { runBasicTests } from "@next-auth/adapter-test";
import SqlAdapter from "../src";
import buildSlonikHelpers from "../src/drivers/slonik";
import { buildUnitOfWork } from "../src/db";
import dbTests from "./shared";
import { createPool } from "slonik";

const poolPromise = createPool("postgres://postgres:postgres@localhost:5432/postgres");

function getConnection() {
  return poolPromise;
}

const helpers = buildSlonikHelpers(getConnection);
const uow = buildUnitOfWork(helpers);

// Close pool after tests
let dbTestsWithDisconnect = {
  ...dbTests(uow),
  disconnect: async () => {
    poolPromise.then((pool) => pool.end());
  },
};

runBasicTests({
  adapter: SqlAdapter(helpers),
  db: dbTestsWithDisconnect,
});
