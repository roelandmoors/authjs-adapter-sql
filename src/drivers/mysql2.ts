import type { Connection } from "mysql2/promise";
import { SqlTag, createSqlTag, Mysql2Driver } from "sql-tagged-template";

export function buildMysql2Helpers(getConnection: () => Promise<Connection>): SqlTag {
  const driver = new Mysql2Driver(getConnection);
  return createSqlTag(driver);
}

export default buildMysql2Helpers;
