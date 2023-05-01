import { VercelPoolClient } from "@vercel/postgres";
import { QueryResultRow, ExecuteResult, Primitive, SqlHelpers } from "./db";

export default function builVercelHelpers(getConnection: () => Promise<VercelPoolClient>): SqlHelpers {
  const execute = async (sql: TemplateStringsArray, ...values: Primitive[]): Promise<ExecuteResult> => {
    const client = await getConnection();
    try {
      const result = await client.sql(sql, ...values);
      return { insertId: Number(result.oid) };
    } finally {
      await client.release();
    }
  };

  const query = async <T extends QueryResultRow>(sql: TemplateStringsArray, ...values: Primitive[]): Promise<T[]> => {
    const client = await getConnection();
    try {
      const { rows } = await client.sql<T>(sql, ...values);
      return rows;
    } finally {
      await client.release();
    }
  };
  return { execute, query };
}
