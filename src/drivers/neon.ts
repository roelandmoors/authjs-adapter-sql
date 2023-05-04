import { Pool } from "@neondatabase/serverless";
import type { ExecuteResult, Primitive, Sql, SqlHelpers } from "../types";
import { buildParameterizedSql } from "../utils";

export default function buildNeonHelpers(pool: Pool): SqlHelpers {
  const execute = async (sql: Sql, ...values: Primitive[]): Promise<ExecuteResult> => {
    const paramSql = buildParameterizedSql(sql, "postgres");
    const { rows } = await pool.query(paramSql, values);
    const insertId = rows.length > 0 ? rows[0]["id"] : null;
    return { insertId: Number(insertId) };
  };

  const query = async <T>(sql: Sql, ...values: Primitive[]): Promise<T[]> => {
    const paramSql = buildParameterizedSql(sql, "postgres");
    const { rows } = await pool.query(paramSql, values);
    return rows as T[];
  };

  return { execute, query, dialect: "postgres" };
}
