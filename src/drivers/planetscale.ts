import type { Client } from "@planetscale/database";
import type { ExecuteResult, Primitive, Sql, SqlHelpers } from "../types";
import { buildParameterizedSql } from "../utils";

const dialect = "mysql";

export function buildPlanetScaleHelpers(client: Client): SqlHelpers {
  const execute = async (sql: Sql, ...values: Primitive[]): Promise<ExecuteResult> => {
    const conn = client.connection();
    const paramSql = buildParameterizedSql(sql, dialect);
    const result = await conn.execute(paramSql, values);
    return { insertId: Number(result.insertId) };
  };

  const query = async <T>(sql: Sql, ...values: Primitive[]): Promise<T[]> => {
    const conn = client.connection();
    const paramSql = buildParameterizedSql(sql, dialect);
    const { rows } = await conn.execute(paramSql, values);
    return rows as T[];
  };

  return { execute, query, dialect };
}

export default buildPlanetScaleHelpers;
