import { VercelPool } from "@vercel/postgres";
import { QueryResultRow, ExecuteResult, Primitive, SqlHelpers } from "./db";

export default function builVercelHelpers(getConnection: () => VercelPool): SqlHelpers {
  const execute = async (sql: ReadonlyArray<string>, ...values: Primitive[]): Promise<ExecuteResult> => {
    const conn = await getConnection();
    const result = await conn.sql({ raw: sql, ...sql } as TemplateStringsArray, ...values);
    return { insertId: Number(result.oid) };
  };

  const query = async <T extends QueryResultRow>(sql: ReadonlyArray<string>, ...values: Primitive[]): Promise<T[]> => {
    const conn = await getConnection();
    const { rows } = await conn.sql<T>({ raw: sql, ...sql } as TemplateStringsArray, ...values);
    return rows;
  };
  return { execute, query, dialect: "postgres" };
}
