import { Kysely, sql } from "kysely";
import type { ExecuteResult, Primitive, Sql, SqlHelpers } from "../types";

const dialect = "mysql";

export default function buildKyselyHelpers(getConnection: () => Kysely<unknown>): SqlHelpers {
  const execute = async (sqlStmt: Sql, ...values: Primitive[]): Promise<ExecuteResult> => {
    const db = await getConnection();
    const result = await sql(sqlStmt as TemplateStringsArray, ...values).execute(db);
    return { insertId: Number(result.insertId) };
  };

  const query = async <T>(sqlStmt: Sql, ...values: Primitive[]): Promise<T[]> => {
    const db = await getConnection();
    const result = await sql<T>(sqlStmt as TemplateStringsArray, ...values).execute(db);
    return result.rows;
  };
  return { execute, query, dialect };
}
