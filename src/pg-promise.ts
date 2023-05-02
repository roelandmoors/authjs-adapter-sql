import { IDatabase } from "pg-promise";
import { ExecuteResult, Primitive, SqlHelpers, arrayToSqlString } from "./db";

type ExtendedProtocol = IDatabase<{}> & {};

export default function buildPgPromiseHelpers(getConnection: () => ExtendedProtocol): SqlHelpers {
  const execute = async (sql: ReadonlyArray<string>, ...values: Primitive[]): Promise<ExecuteResult> => {
    const db = getConnection();
    const sqlStr = arrayToSqlString(sql, "postgres");
    const result = await db.query(sqlStr, values);
    let insertId: number;
    if (result.length > 0) {
      insertId = result[0]["id"];
    }
    console.log({ sqlStr, values, result });
    return { insertId: result as number };
  };

  const query = async <T>(sql: ReadonlyArray<string>, ...values: Primitive[]): Promise<T[]> => {
    const db = getConnection();
    const sqlStr = arrayToSqlString(sql, "postgres");
    const result = await db.query(sqlStr, values);
    console.log({ sqlStr, values, result });

    return result;
  };
  return { execute, query, dialect: "postgres" };
}
