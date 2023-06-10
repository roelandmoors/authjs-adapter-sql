import type { ExecuteResult, PrimitiveDefined, Sql, SqlHelpers } from "../types";
import { DatabasePool, sql } from "slonik";
import { datetimeToLocalStr, datetimeToString } from "../utils";

const dialect = "postgres";

export function buildSlonikHelpers(getConnection: () => Promise<DatabasePool>): SqlHelpers {
  const execute = async (sqlStmt: Sql, ...values: PrimitiveDefined[]): Promise<ExecuteResult> => {
    const connection = await getConnection();
    const result = await connection.query(sql.unsafe(sqlStmt, ...values));
    const insertId = result.rows && result.rows.length > 0 ? result.rows[0]["id"] : null;
    return { insertId: Number(insertId) };
  };

  const query = async <T>(sqlStmt: Sql, ...values: PrimitiveDefined[]): Promise<T[]> => {
    const connection = await getConnection();
    const result = await connection.query(sql.unsafe(sqlStmt, ...values));
    const rows = result.rows as T[];

    // Convert timestamps to Date
    for (let r = 0; r < rows.length; r++) {
      for (let f = 0; f < result.fields.length; f++) {
        const field = result.fields[f];
        if (field.dataTypeId === 1114) {
          const row = rows[r] as any;
          //console.log({ field, value: row[field.name] });
          if (field.name == "expires") {
            // Why is expires not in UTC? What am I doing wrong?
            // Need to look into this if it is less hot in here. Going to join the kids in the pool..
            row[field.name] = datetimeToString(new Date(row[field.name]), 0);
          } else {
            row[field.name] = datetimeToLocalStr(new Date(row[field.name]));
          }
        }
      }
    }

    return rows;
  };
  return { execute, query, dialect };
}

export default buildSlonikHelpers;
