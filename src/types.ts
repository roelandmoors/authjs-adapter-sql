export interface ExecuteResult {
  insertId: number;
}

export type Dialect = "postgres" | "mysql";

export type Primitive = string | number | boolean | undefined | null;

export type Sql = string | readonly string[];

export interface QueryResultRow {
  [column: string]: any;
}

export interface SqlHelpers {
  dialect: Dialect;
  execute: (sql: Sql, ...values: Primitive[]) => Promise<ExecuteResult>;
  query: <T extends QueryResultRow>(sql: Sql, ...values: Primitive[]) => Promise<T[]>;
}

export interface ExtendedSqlHelpers extends SqlHelpers {
  queryOne: <T extends QueryResultRow>(sql: Sql, ...values: Primitive[]) => Promise<T | null>;
  insert: (sql: Sql, ...values: Primitive[]) => Promise<ExecuteResult>;
}
