import { VercelPool } from "@vercel/postgres";
import { QueryResultRow, ExecuteResult, Primitive, SqlHelpers } from "./db";

export default function builVercelHelpers(getConnection: () => VercelPool): SqlHelpers {
  const execute = async (sql: ReadonlyArray<string>, ...values: Primitive[]): Promise<ExecuteResult> => {
    const client = getConnection();
    const conn = await client.connect();
    try {
      const result = await conn.sql({ raw: sql, ...sql } as TemplateStringsArray, ...values);
      return { insertId: Number(result.oid) };
    } finally {
      await conn.release();
    }
  };

  const query = async <T extends QueryResultRow>(sql: ReadonlyArray<string>, ...values: Primitive[]): Promise<T[]> => {
    const client = await getConnection();
    const conn = await client.connect();
    try {
      const { rows } = await conn.sql<T>({ raw: sql, ...sql } as TemplateStringsArray, ...values);
      return rows;
    } finally {
      await conn.release();
    }
  };
  return { execute, query };
}
