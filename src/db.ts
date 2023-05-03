import { AccountRepo } from "./repo/account";
import { SessionRepo } from "./repo/session";
import { UserRepo } from "./repo/user";
import { VerificationTokenRepo } from "./repo/verification";
import { ExecuteResult, ExtendedSqlHelpers, Primitive, QueryResultRow, Sql, SqlHelpers } from "./types";
import { replaceUndefined } from "./utils";

function buildExtendedSqlHelpers(sqlHelpers: SqlHelpers): ExtendedSqlHelpers {
  const execute = async (sql: Sql, ...values: Primitive[]): Promise<ExecuteResult> => {
    const replacedValues = replaceUndefined(values);
    return await sqlHelpers.execute(sql, ...replacedValues);
  };

  //samen as execute, but return the id for postgres
  const insert = async (sql: Sql, ...values: Primitive[]): Promise<ExecuteResult> => {
    let insertSql = sql.concat();
    if (sqlHelpers.dialect == "postgres") {
      if (typeof insertSql === "string" || insertSql instanceof String) {
        insertSql += " returning id";
      } else {
        insertSql[insertSql.length - 1] += " returning id";
      }
    }
    return await execute(insertSql, ...values);
  };

  const queryOne = async <T extends QueryResultRow>(sql: Sql, ...values: Primitive[]): Promise<T | null> => {
    const rows = await sqlHelpers.query<T>(sql, ...values);
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
