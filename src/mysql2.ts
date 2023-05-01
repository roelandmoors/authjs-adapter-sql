import type { Connection, ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { ExecuteResult, Primitive, SqlHelpers } from "./db";

export default function buildMysql2Helpers(getConnection: () => Promise<Connection>): SqlHelpers {
  const execute = async (sql: TemplateStringsArray, ...values: Primitive[]): Promise<ExecuteResult> => {
    const conn = await getConnection();
    try {
      const result = (await conn.execute(sql.join("?"), values)) as ResultSetHeader[];
      return { insertId: Number(result[0].insertId) };
    } finally {
      await conn.end();
    }
  };

  const query = async <T>(sql: TemplateStringsArray, ...values: Primitive[]): Promise<T[]> => {
    const conn = await getConnection();
    try {
      const [rows] = await conn.query<T[] & RowDataPacket[][]>(sql.join("?"), values);
      return rows;
    } finally {
      await conn.end();
    }
  };
  return { execute, query };
}
