import type { IDatabase } from "pg-promise";
import type { ExecuteResult, Primitive, Sql, SqlHelpers } from "../types";
import { buildParameterizedSql } from "../utils";

const dialect = "postgres";

export function buildPgPromiseHelpers(getConnection: () => IDatabase<{}> & {}): SqlHelpers {
  const execute = async (sql: Sql, ...values: Primitive[]): Promise<ExecuteResult> => {
    const db = getConnection();
    const paramSql = buildParameterizedSql(sql, dialect);
    const result = await db.query(paramSql, values);
    const insertId = result.length > 0 ? result[0]["id"] : null;
    return { insertId: Number(insertId) };
  };

  const query = async <T>(sql: Sql, ...values: Primitive[]): Promise<T[]> => {
    const db = getConnection();
    const paramSql = buildParameterizedSql(sql, dialect);
    return await db.query(paramSql, values);
  };
  return { execute, query, dialect };
}

export default buildPgPromiseHelpers;
