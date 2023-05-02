import { Client } from "@planetscale/database";
import { ExecuteResult, Primitive, SqlHelpers, arrayToSqlString } from "./db";

export default function buildPlanetScaleHelpers(client: Client): SqlHelpers {
  const execute = async (sql: ReadonlyArray<string>, ...values: Primitive[]): Promise<ExecuteResult> => {
    const conn = client.connection();
    const result = await conn.execute(arrayToSqlString(sql, "mysql"), values);
    return { insertId: Number(result.insertId) };
  };

  const query = async <T>(sql: ReadonlyArray<string>, ...values: Primitive[]): Promise<T[]> => {
    const conn = client.connection();
    const { rows } = await conn.execute(arrayToSqlString(sql, "mysql"), values);
    return rows as T[];
  };

  return { execute, query, dialect: "mysql" };
}
