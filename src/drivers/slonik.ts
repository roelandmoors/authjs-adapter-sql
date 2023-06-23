import { DatabasePool, sql } from "slonik";
import { SqlTag, createSqlTag, SlonikDriver } from "sql-tagged-template";

export function buildSlonikHelpers(getConnection: () => Promise<DatabasePool>): SqlTag {
  const driver = new SlonikDriver(getConnection, sql);
  return createSqlTag(driver, { addReturningId: true });
}

export default buildSlonikHelpers;
