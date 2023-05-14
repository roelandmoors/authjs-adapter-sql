import { Kysely, RawBuilder, RawNode, sql } from "kysely";
import type { ExecuteResult, Primitive, Sql, SqlHelpers } from "../types";
import { createQueryId } from "kysely/dist/cjs/util/query-id";
import { parseValueExpression } from "kysely/dist/cjs/parser/value-parser";

const dialect = "mysql";

export default function buildKyselyHelpers(getConnection: () => Kysely<unknown>): SqlHelpers {
  const execute = async (sqlStmt: Sql, ...values: Primitive[]): Promise<ExecuteResult> => {
    const db = await getConnection();
    //const builder = createRawBuilder(sql, ...values);
    //const result = await builder.execute(db);
    const result = await sql(sqlStmt as TemplateStringsArray, ...values).execute(db);
    return { insertId: Number(result.insertId) };
  };

  const query = async <T>(sqlStmt: Sql, ...values: Primitive[]): Promise<T[]> => {
    const db = await getConnection();
    //const builder = createRawBuilder<T>(sql, ...values);
    //const result = await builder.execute(db);
    const result = await sql<T>(sqlStmt as TemplateStringsArray, ...values).execute(db);
    return result.rows;
  };
  return { execute, query, dialect };
}

// function createRawBuilder<T>(sql: Sql, ...values: Primitive[]): RawBuilder<T> {
//   return new RawBuilder({
//     queryId: createQueryId(),
//     rawNode: RawNode.create(sql, values?.map(parseValueExpression) ?? []),
//   });
// }
