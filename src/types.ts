export interface Configuration {
  prefix?: string;
  verbose: boolean;
}

export interface ExecuteResult {
  insertId: number;
}

export type Dialect = "postgres" | "mysql";

export type Primitive = string | number | boolean | undefined | null;
export type PrimitiveDefined = string | number | boolean | null;

export type Sql = readonly string[];

export interface QueryResultRow {
  [column: string]: any;
}

export interface SqlHelpers {
  dialect: Dialect;
  execute: (sql: Sql, ...values: PrimitiveDefined[]) => Promise<ExecuteResult>;
  query: <T extends QueryResultRow>(sql: Sql, ...values: PrimitiveDefined[]) => Promise<T[]>;
}

export interface ExtendedSqlHelpers extends SqlHelpers {
  queryOne: <T extends QueryResultRow>(sql: Sql, ...values: Primitive[]) => Promise<T | null>;
  insert: (sql: Sql, ...values: Primitive[]) => Promise<ExecuteResult>;
}
