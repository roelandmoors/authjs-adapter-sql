import { VercelPoolClient } from "@vercel/postgres";
import { ExecuteResult, SqlHelpers } from "./db";

export default function builVercelHelpers(getConnection: () => Promise<VercelPoolClient>): SqlHelpers {
  const execute = async (sql: string, values: any[]): Promise<ExecuteResult> => {
    const client = await getConnection();
    try {
      const result = (await client.sql(sql, values)) as ResultSetHeader[];
      return { insertId: Number(result[0].insertId) };
    } finally {
      await client.release();
    }
  };

  const query = async <T>(sql: string, values: any[]): Promise<T[]> => {
    const client = await getConnection();
    try {
      const [rows] = await client.sql<T[] & RowDataPacket[][]>(sql, values);
      return rows;
    } finally {
      await client.release();
    }
  };
  return { execute, query };
}
