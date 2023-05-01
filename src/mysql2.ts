import type { Connection, ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { ExecuteResult, Primitive, SqlHelpers } from "./db";

export default function buildMysql2Helpers(getConnection: () => Promise<Connection>): SqlHelpers {
  const execute = async (sql: ReadonlyArray<string>, ...values: Primitive[]): Promise<ExecuteResult> => {
    const conn = await getConnection();
    try {
      const result = (await conn.execute(toSqlString(sql), values)) as ResultSetHeader[];
      return { insertId: Number(result[0].insertId) };
    } finally {
      await conn.end();
    }
  };

  const query = async <T>(sql: ReadonlyArray<string>, ...values: Primitive[]): Promise<T[]> => {
    const conn = await getConnection();
    try {
      const [rows] = await conn.query<T[] & RowDataPacket[][]>(toSqlString(sql), values);
      return rows;
    } finally {
      await conn.end();
    }
  };
  return { execute, query };
}

// TODO: make this smarter and easier
function toSqlString(o: any): string {
  let sql = "";
  if (Array.isArray(sql)) {
    sql = (o as string[]).join("?");
  } else if (typeof o === "string" || o instanceof String) {
    sql = o as string;
  } else if (o.hasOwnProperty("raw")) {
    sql = (o as TemplateStringsArray).raw.join("?");
  } else {
    sql = Array.from(o).join("?");
  }
  //console.log({ sql, o, t: typeof o });
  return sql;
}
