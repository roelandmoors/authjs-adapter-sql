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
  execute: (sql: TemplateStringsArray, ...values: Primitive[]) => Promise<ExecuteResult>;
  query: <T extends QueryResultRow>(sql: TemplateStringsArray, ...values: Primitive[]) => Promise<T[]>;
}

export interface ExtendedSqlHelpers extends SqlHelpers {
  queryOne: <T extends QueryResultRow>(sql: TemplateStringsArray, ...values: Primitive[]) => Promise<T | null>;
}

function replaceUndefined(values: any[]) {
  return values.map((x) => {
    if (x === undefined) return null;
    return x;
  });
}

function buildExtendedSqlHelpers(sqlHelpers: SqlHelpers): ExtendedSqlHelpers {
  const execute = async (sql: TemplateStringsArray, ...values: Primitive[]): Promise<ExecuteResult> => {
    const replacedValues = replaceUndefined(values);
    return await sqlHelpers.execute(sql, ...replacedValues);
  };

  const queryOne = async <T extends QueryResultRow>(
    sql: TemplateStringsArray,
    ...values: Primitive[]
  ): Promise<T | null> => {
    const rows = await sqlHelpers.query<T>(sql, ...values);
    if (rows.length == 1) return rows[0];
    return null;
  };

  return { ...sqlHelpers, execute, queryOne };
}

export const convertDate = (d: Date | string | null): Date | null => {
  let emailVerified: Date | null;
  if (typeof d === "string") {
    emailVerified = new Date(Date.parse(d + "Z"));
  } else {
    emailVerified = d;
  }
  return emailVerified;
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
