import { runBasicTests } from "@next-auth/adapter-test";
import { SqlAdapter } from "../src";
import buildKnexHelpers from "../src/drivers/knex";
import { buildUnitOfWork } from "../src/db";
import { Knex, knex } from "knex";
import dbTests from "./shared";

const config: Knex.Config = {
  client: "pg",
  connection: {
    host: "localhost",
    database: "postgres",
    user: "postgres",
    password: "postgres",
  },
};

const knexInstance = knex(config);

const helpers = buildKnexHelpers(knexInstance, "postgres");
const uow = buildUnitOfWork(helpers);

// Close pool after tests
let dbTestsWithDisconnect = {
  ...dbTests(uow),
  disconnect: async () => {
    await knexInstance.destroy();
  },
};

runBasicTests({
  adapter: SqlAdapter(helpers),
  db: dbTestsWithDisconnect,
});
