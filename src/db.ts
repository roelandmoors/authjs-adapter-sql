import { AccountRepo } from "./repo/account";
import { SessionRepo } from "./repo/session";
import { UserRepo } from "./repo/user";
import { VerificationTokenRepo } from "./repo/verification";
import { Configuration, ExecuteResult, ExtendedSqlHelpers, Primitive, QueryResultRow, Sql, SqlHelpers } from "./types";
import { replacePrefix, replaceUndefined } from "./utils";

function buildExtendedSqlHelpers(sqlHelpers: SqlHelpers, config: Configuration): ExtendedSqlHelpers {
  const execute = async (sql: Sql, ...values: Primitive[]): Promise<ExecuteResult> => {
    const replacedValues = replaceUndefined(values);
    const sqlWithPrefix = replacePrefix(sql, config.prefix);
    return await sqlHelpers.execute(sqlWithPrefix, ...replacedValues);
  };

  //samen as execute, but return the id for postgres
  const insert = async (sql: Sql, ...values: Primitive[]): Promise<ExecuteResult> => {
    let insertSql = sql.concat();
    if (sqlHelpers.dialect == "postgres") {
      insertSql[insertSql.length - 1] += " returning id";
    }
    return await execute(insertSql, ...values);
  };

  const queryOne = async <T extends QueryResultRow>(sql: Sql, ...values: Primitive[]): Promise<T | null> => {
    const sqlWithPrefix = replacePrefix(sql, config.prefix);
    const replacedValues = replaceUndefined(values);
    const rows = await sqlHelpers.query<T>(sqlWithPrefix, ...replacedValues);
    if (rows.length == 1) return rows[0];
    return null;
  };

  return { ...sqlHelpers, execute, queryOne, insert };
}

export interface UnitOfWork {
  users: UserRepo;
  sessions: SessionRepo;
  accounts: AccountRepo;
  verificationTokens: VerificationTokenRepo;
  raw: ExtendedSqlHelpers;
}

export function buildUnitOfWork(sqlHelpers: SqlHelpers, config?: Configuration): UnitOfWork {
  config ||= {};
  config.prefix ||= "";

  const esqlHelpers = buildExtendedSqlHelpers(sqlHelpers, config);

  return {
    users: new UserRepo(esqlHelpers, config),
    sessions: new SessionRepo(esqlHelpers, config),
    accounts: new AccountRepo(esqlHelpers, config),
    verificationTokens: new VerificationTokenRepo(esqlHelpers, config),
    raw: esqlHelpers,
  };
}
