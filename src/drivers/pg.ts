import { PoolClient } from "pg";
import { SqlTag, createSqlTag, PgDriver } from "sql-tagged-template";

export function buildPgHelpers(getConnection: () => Promise<PoolClient>): SqlTag {
  const driver = new PgDriver(getConnection);
  return createSqlTag(driver, { addReturningId: true });
}

export default buildPgHelpers;
