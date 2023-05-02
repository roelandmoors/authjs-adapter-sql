import { AccountRepo } from "./repo/account";
import { SessionRepo } from "./repo/session";
import { UserRepo } from "./repo/user";
import { VerificationTokenRepo } from "./repo/verification";

export interface ExecuteResult {
  insertId: number;
}

export type Dialect = "postgres" | "mysql";

export type Primitive = string | number | boolean | undefined | null;

export interface QueryResultRow {
  [column: string]: any;
}

export interface SqlHelpers {
  dialect: Dialect;
  execute: (sql: ReadonlyArray<string>, ...values: Primitive[]) => Promise<ExecuteResult>;
  query: <T extends QueryResultRow>(sql: ReadonlyArray<string>, ...values: Primitive[]) => Promise<T[]>;
}

export interface ExtendedSqlHelpers extends SqlHelpers {
  queryOne: <T extends QueryResultRow>(sql: ReadonlyArray<string>, ...values: Primitive[]) => Promise<T | null>;
  insert: (sql: ReadonlyArray<string>, ...values: Primitive[]) => Promise<ExecuteResult>;
}

function replaceUndefined(values: any[]) {
  return values.map((x) => {
    if (x === undefined) return null;
    return x;
  });
}

function buildExtendedSqlHelpers(sqlHelpers: SqlHelpers): ExtendedSqlHelpers {
  const execute = async (sql: ReadonlyArray<string>, ...values: Primitive[]): Promise<ExecuteResult> => {
    const replacedValues = replaceUndefined(values);
    return await sqlHelpers.execute(sql, ...replacedValues);
  };

  const insert = async (sql: ReadonlyArray<string>, ...values: Primitive[]): Promise<ExecuteResult> => {
    const replacedValues = replaceUndefined(values);
    const s = sql as string[];
    if (sqlHelpers.dialect == "postgres") {
      s[s.length - 1] += " returning id";
    }
    return await sqlHelpers.execute(s, ...replacedValues);
  };

  const queryOne = async <T extends QueryResultRow>(
    sql: ReadonlyArray<string>,
    ...values: Primitive[]
  ): Promise<T | null> => {
    const rows = await sqlHelpers.query<T>(sql, ...values);
    if (rows.length == 1) return rows[0];
    return null;
  };

  return { ...sqlHelpers, execute, queryOne, insert };
}

export const convertDate = (d: Date | string | null, addZ: boolean = false): Date | null => {
  if (typeof d === "string") {
    if (addZ) d += "Z";
    return new Date(Date.parse(d));
  } else return d;
};

export interface UnitOfWork {
  users: UserRepo;
  sessions: SessionRepo;
  accounts: AccountRepo;
  verificationTokens: VerificationTokenRepo;
  raw: ExtendedSqlHelpers;
}

export function buildUnitOfWork(sqlHelpers: SqlHelpers): UnitOfWork {
  const esqlHelpers = buildExtendedSqlHelpers(sqlHelpers);

  return {
    users: new UserRepo(esqlHelpers),
    sessions: new SessionRepo(esqlHelpers),
    accounts: new AccountRepo(esqlHelpers),
    verificationTokens: new VerificationTokenRepo(esqlHelpers),
    raw: esqlHelpers,
  };
}

export function datetimeToStr(expires?: Date) {
  if (!expires) expires = new Date();
  const tzoffset = expires.getTimezoneOffset() * 60000; //offset in milliseconds
  const localISOTime = new Date(expires.getTime() - tzoffset).toISOString().slice(0, -1);
  return localISOTime;
}

function generatePlaceholders(o: readonly string[], dialect: Dialect): string {
  if (dialect == "mysql") return o.join("?");

  let result = "";
  for (let i = 0; i < o.length - 1; i++) {
    const part = o[i];
    result += part + "$" + (i + 1).toString();
  }
  result += o[o.length - 1];
  return result;
}

// TODO: make this smarter and easier
export function arrayToSqlString(o: any, dialect: Dialect): string {
  let sql = "";
  if (Array.isArray(sql)) {
    sql = generatePlaceholders(o, dialect);
  } else if (typeof o === "string" || o instanceof String) {
    sql = o as string;
  } else if (o.hasOwnProperty("raw")) {
    sql = generatePlaceholders((o as TemplateStringsArray).raw, dialect);
  } else {
    sql = generatePlaceholders(Array.from(o), dialect);
  }
  return sql;
}
