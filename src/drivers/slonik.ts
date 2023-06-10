import type { ExecuteResult, Primitive, Sql, SqlHelpers } from "../types";
import { DatabasePool, sql } from "slonik";
import { datetimeToLocalStr, datetimeToString } from "../utils";

const dialect = "postgres";

export function buildSlonikHelpers(getConnection: () => Promise<DatabasePool>): SqlHelpers {
  const execute = async (sqlStmt: Sql, ...values: Primitive[]): Promise<ExecuteResult> => {
    const connection = await getConnection();
    const result = await connection.query(sql.unsafe(sqlStmt, ...values));
    const insertId = result.rows && result.rows.length > 0 ? result.rows[0]["id"] : null;
    return { insertId: Number(insertId) };
  };

  const query = async <T>(sqlStmt: Sql, ...values: Primitive[]): Promise<T[]> => {
    const connection = await getConnection();
    const result = await connection.query(sql.unsafe(sqlStmt, ...values));
    const rows = result.rows as T[];

    // Convert timestamps to Date
    for (let r = 0; r < rows.length; r++) {
      for (let f = 0; f < result.fields.length; f++) {
        const field = result.fields[f];
        if (field.dataTypeId === 1114) {
          //console.log({ field, value: rows[r][field.name] });
          if (field.name == "expires") {
            // Why is expires not in UTC? What am I doing wrong?
            // Need to look into this if it is less hot in here. Going to join the kids in the pool..
            rows[r][field.name] = datetimeToString(new Date(rows[r][field.name]), 0);
          } else {
            rows[r][field.name] = datetimeToLocalStr(new Date(rows[r][field.name]));
          }
        }
      }
    }

    return rows;
  };
  return { execute, query, dialect };
}

export default buildSlonikHelpers;
