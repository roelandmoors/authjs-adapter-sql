import { Kysely, sql as ksql } from "kysely";
import type { ExecuteResult, Primitive, Sql, SqlHelpers } from "../types";

const dialect = "mysql";

export default function buildKyselyHelpers(getConnection: () => Kysely<unknown>): SqlHelpers {
  const execute = async (sql: Sql, ...values: Primitive[]): Promise<ExecuteResult> => {
    const db = await getConnection();
    const tsql = sql as TemplateStringsArray;
    const result = await ksql(tsql, ...values).execute(db);
    return { insertId: Number(result.insertId) };
  };

  const query = async <T>(sql: Sql, ...values: Primitive[]): Promise<T[]> => {
    const db = await getConnection();
    const tsql = sql as TemplateStringsArray;
    const result = await ksql<T>(tsql, ...values).execute(db);
    return result.rows;
  };
  return { execute, query, dialect };
}
