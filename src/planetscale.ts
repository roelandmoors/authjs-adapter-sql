import { Client } from "@planetscale/database";
import { ExecuteResult, SqlHelpers } from "./db";
import generateNanoId from "./nanoid";

export default function buildPlanetScaleHelpers(client: Client): SqlHelpers {
  const execute = async (sql: string, values: any[]): Promise<ExecuteResult> => {
    const conn = client.connection();
    const result = await conn.execute(sql, values);
    return { insertId: BigInt(result.insertId) };
  };

  const query = async <T>(sql: string, values: any[]): Promise<T[]> => {
    const conn = client.connection();
    const { rows } = await conn.execute(sql, values);
    return rows as T[];
  };

  return { execute, query, generateId: generateNanoId };
}
