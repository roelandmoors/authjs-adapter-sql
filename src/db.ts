import { AccountRepo } from "./repo/account";
import { SessionRepo } from "./repo/session";
import { UserRepo } from "./repo/user";
import { VerificationTokenRepo } from "./repo/verification";

export interface ExecuteResult {
  insertId: bigint;
}

export interface SqlHelpers {
  execute: (sql: string, values: any[]) => Promise<ExecuteResult>;
  query: <T>(sql: string, values: any[]) => Promise<T[]>;
  generateId: () => string;
}

export interface ExtendedSqlHelpers extends SqlHelpers {
  queryOne: <T>(sql: string, values: any[]) => Promise<T | null>;
}

function replaceUndefined(values: any[]) {
  return values.map((x) => {
    if (x === undefined) return null;
    return x;
  });
}

function buildExtendedSqlHelpers(sqlHelpers: SqlHelpers): ExtendedSqlHelpers {
  const execute = async (sql: string, values: any[]): Promise<ExecuteResult> => {
    const replacedValues = replaceUndefined(values);
    return await sqlHelpers.execute(sql, replacedValues);
  };

  const queryOne = async <T>(sql: string, values: any[]): Promise<T | null> => {
    const rows = await sqlHelpers.query<T>(sql, values);
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

export function buildUnitOfWork(sqlHelpers: SqlHelpers) {
  const esqlHelpers = buildExtendedSqlHelpers(sqlHelpers);

  return {
    users: new UserRepo(esqlHelpers),
    sessions: new SessionRepo(esqlHelpers),
    accounts: new AccountRepo(esqlHelpers),
    verificationTokens: new VerificationTokenRepo(esqlHelpers),
    raw: esqlHelpers,
  };
}
