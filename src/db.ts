import { AccountRepo } from "./repo/account";
import { SessionRepo } from "./repo/session";
import { UserRepo } from "./repo/user";
import { VerificationTokenRepo } from "./repo/verification";

export interface ExecuteResult {
  insertId: number;
}

export type Primitive = string | number | boolean | undefined | null;

export interface QueryResultRow {
  [column: string]: any;
}

export interface SqlHelpers {
  execute: (sql: ReadonlyArray<string>, ...values: Primitive[]) => Promise<ExecuteResult>;
  query: <T extends QueryResultRow>(sql: ReadonlyArray<string>, ...values: Primitive[]) => Promise<T[]>;
}

export interface ExtendedSqlHelpers extends SqlHelpers {
  queryOne: <T extends QueryResultRow>(sql: ReadonlyArray<string>, ...values: Primitive[]) => Promise<T | null>;
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

  const queryOne = async <T extends QueryResultRow>(
    sql: ReadonlyArray<string>,
    ...values: Primitive[]
  ): Promise<T | null> => {
    const rows = await sqlHelpers.query<T>(sql, ...values);
    if (rows.length == 1) return rows[0];
    return null;
  };

  return { ...sqlHelpers, execute, queryOne };
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

// TODO: make this smarter and easier
export function arrayToSqlString(o: any): string {
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
  return sql;
}
