import type { Knex } from "knex";
import { Dialect } from "../types";

import { SqlTag, createSqlTag, KnexDriver } from "sql-tagged-template";

export function buildKnexHelpers(knex: Knex, dialect: Dialect): SqlTag {
  const driver = new KnexDriver(knex, dialect);
  return createSqlTag(driver, { addReturningId: dialect === "postgres" });
}

export default buildKnexHelpers;
