import type { Connection, ResultSetHeader, RowDataPacket } from "mysql2/promise";
import type { ExecuteResult, Primitive, Sql, SqlHelpers } from "../types";
import { buildParameterizedSql } from "../utils";

const dialect = "mysql";

export function buildMysql2Helpers(getConnection: () => Promise<Connection>): SqlHelpers {
  const execute = async (sql: Sql, ...values: Primitive[]): Promise<ExecuteResult> => {
    const conn = await getConnection();
    try {
      const paramSql = buildParameterizedSql(sql, dialect);
      const result = (await conn.execute(paramSql, values)) as ResultSetHeader[];
      return { insertId: Number(result[0].insertId) };
    } finally {
      await conn.end();
    }
  };

  const query = async <T>(sql: Sql, ...values: Primitive[]): Promise<T[]> => {
    const conn = await getConnection();
    try {
      const paramSql = buildParameterizedSql(sql, dialect);
      const [rows] = await conn.query<T[] & RowDataPacket[][]>(paramSql, values);
      return rows;
    } finally {
      await conn.end();
    }
  };
  return { execute, query, dialect };
}

export default buildMysql2Helpers;
