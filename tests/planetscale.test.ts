require("dotenv").config();
import { Client } from "@planetscale/database";
import fetch from "node-fetch";
import { runBasicTests } from "@next-auth/adapter-test";
import SqlAdapter from "../src";
import { buildUnitOfWork } from "../src/db";
import buildPlanetScaleHelpers from "../src/drivers/planetscale";
import dbTests from "./shared";

const config = {
  fetch: fetch,
  host: process.env.PLANETSCALE_HOST,
  username: process.env.PLANETSCALE_USERNAME,
  password: process.env.PLANETSCALE_PASSWORD,
};

const client = new Client(config);
const helpers = buildPlanetScaleHelpers(client);
const db = buildUnitOfWork(helpers);

runBasicTests({
  adapter: SqlAdapter(helpers),
  db: dbTests(db),
});
