import type { PoolClient } from "pg";
import type { ExecuteResult, Primitive, Sql, SqlHelpers } from "../types";
import { buildParameterizedSql } from "../utils";

const dialect = "postgres";

export function buildPgHelpers(getConnection: () => Promise<PoolClient>): SqlHelpers {
  const execute = async (sql: Sql, ...values: Primitive[]): Promise<ExecuteResult> => {
    const paramSql = buildParameterizedSql(sql, dialect);
    const db = await getConnection();
    let result;
    try {
      result = await db.query(paramSql, values);
    } finally {
      db.release();
    }
    let insertId: number = 0;
    if (result && result.rows && result.rows[0]) insertId = Number(result.rows[0]["id"]);
    return { insertId };
  };

  const query = async <T>(sql: Sql, ...values: Primitive[]): Promise<T[]> => {
    const paramSql = buildParameterizedSql(sql, dialect);
    const db = await getConnection();
    let rows;
    try {
      const result = await db.query(paramSql, values);
      rows = result.rows;
    } finally {
      db.release();
    }
    return rows;
  };
  return { execute, query, dialect };
}

export default buildPgHelpers;
