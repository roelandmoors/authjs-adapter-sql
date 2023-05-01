import { Client } from "@planetscale/database";
import { ExecuteResult, Primitive, SqlHelpers } from "./db";

export default function buildPlanetScaleHelpers(client: Client): SqlHelpers {
  const execute = async (sql: ReadonlyArray<string>, ...values: Primitive[]): Promise<ExecuteResult> => {
    const conn = client.connection();
    const result = await conn.execute(sql.join("?"), values);
    return { insertId: Number(result.insertId) };
  };

  const query = async <T>(sql: ReadonlyArray<string>, ...values: Primitive[]): Promise<T[]> => {
    const conn = client.connection();
    const { rows } = await conn.execute(sql.join("?"), values);
    return rows as T[];
  };

  return { execute, query };
}
