import type { Knex } from "knex";
import { Dialect, ExecuteResult, Primitive, Sql, SqlHelpers } from "../types";
import { buildParameterizedSql } from "../utils";

export function buildKnexHelpers(knex: Knex, dialect: Dialect): SqlHelpers {
  const execute = async (sql: Sql, ...values: Primitive[]): Promise<ExecuteResult> => {
    const paramSql = buildParameterizedSql(sql, "mysql");
    const result = await knex.raw(paramSql, values);
    if (dialect == "mysql") return { insertId: Number(result[0].insertId) };
    let insertId = 0;
    if (result.rows && result.rows[0]) insertId = (result.rows[0] as any)["id"];
    return { insertId };
  };

  const query = async <T>(sql: Sql, ...values: Primitive[]): Promise<T[]> => {
    const paramSql = buildParameterizedSql(sql, "mysql");
    const result = await knex.raw(paramSql, values);
    if (dialect == "mysql") return result[0];
    return result.rows;
  };
  return { execute, query, dialect };
}

export default buildKnexHelpers;
