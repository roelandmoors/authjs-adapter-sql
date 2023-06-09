import { runBasicTests } from "@next-auth/adapter-test";
import { SqlAdapter } from "../src";
import buildKnexHelpers from "../src/drivers/knex";
import { buildUnitOfWork } from "../src/db";
import { Knex, knex } from "knex";
import dbTests from "./shared";

const config: Knex.Config = {
  client: "mysql2",
  connection: {
    host: "127.0.0.1",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE || "authjs_test",
  },
};

const knexInstance = knex(config);

const helpers = buildKnexHelpers(knexInstance, "mysql");
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
