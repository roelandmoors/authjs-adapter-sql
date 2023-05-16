import { Kysely, sql } from "kysely";
import type { Dialect, ExecuteResult, Primitive, Sql, SqlHelpers } from "../types";

export default function buildKyselyHelpers(db: Kysely<any>, dialect: Dialect): SqlHelpers {
  const execute = async (sqlStmt: Sql, ...values: Primitive[]): Promise<ExecuteResult> => {
    const result = await sql(sqlStmt as TemplateStringsArray, ...values).execute(db);
    let insertId = Number(result.insertId);
    if (!insertId && result.rows && result.rows[0]) insertId = (result.rows[0] as any)["id"];
    return { insertId };
  };

  const query = async <T>(sqlStmt: Sql, ...values: Primitive[]): Promise<T[]> => {
    const result = await sql<T>(sqlStmt as TemplateStringsArray, ...values).execute(db);
    return result.rows;
  };
  return { execute, query, dialect };
}
