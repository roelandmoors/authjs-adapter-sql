import type { Connection, ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { buildParameterizedSql } from "../utils";
import { SqlTag, createSqlTag } from "sql-tagged-template";
import Mysql2Driver from "sql-tagged-template/drivers/mysql2";

export function buildMysql2Helpers(getConnection: () => Promise<Connection>): SqlTag {
  const driver = new Mysql2Driver(getConnection);
  return createSqlTag(driver);
  // const execute = async (sql: Sql, ...values: Primitive[]): Promise<ExecuteResult> => {
  //   try {
  //     const paramSql = buildParameterizedSql(sql, dialect);
  //     const result = (await conn.execute(paramSql, values)) as ResultSetHeader[];
  //     return { insertId: Number(result[0].insertId) };
  //   } finally {
  //     await conn.end();
  //   }
  // };

  // const query = async <T>(sql: Sql, ...values: Primitive[]): Promise<T[]> => {
  //   const conn = await getConnection();
  //   try {
  //     const paramSql = buildParameterizedSql(sql, dialect);
  //     const [rows] = await conn.query<T[] & RowDataPacket[][]>(paramSql, values);
  //     return rows;
  //   } finally {
  //     await conn.end();
  //   }
  // };
  // return { execute, query, dialect };
}

export default buildMysql2Helpers;
