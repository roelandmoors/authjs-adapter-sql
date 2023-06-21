import { SqlTag } from "sql-tagged-template";
import { AccountRepo } from "./repo/account";
import { SessionRepo } from "./repo/session";
import { UserRepo } from "./repo/user";
import { VerificationTokenRepo } from "./repo/verification";
import { Configuration, ExecuteResult, ExtendedSqlHelpers, Primitive, QueryResultRow, Sql, SqlHelpers } from "./types";
import { replacePrefix, replaceUndefined } from "./utils";

// function buildExtendedSqlHelpers(sqltag: SqlTag, config: Configuration): ExtendedSqlHelpers {
//   const execute = async (sql: Sql, ...values: Primitive[]): Promise<ExecuteResult> => {
//     const replacedValues = replaceUndefined(values);
//     const sqlWithPrefix = replacePrefix(sql, config.prefix);
//     return await sqltag(sqlWithPrefix, ...replacedValues).query();
//   };

//   //samen as execute, but return the id for postgres
//   const insert = async (sql: Sql, ...values: Primitive[]): Promise<ExecuteResult> => {
//     // let insertSql = sql.concat();
//     // if (sqltag.dialect == "postgres") {
//     //   insertSql[insertSql.length - 1] += " returning id";
//     // }
//     return await execute(insertSql, ...values);
//   };

//   const queryOne = async <T extends QueryResultRow>(sql: Sql, ...values: Primitive[]): Promise<T | null> => {
//     const sqlWithPrefix = replacePrefix(sql, config.prefix);
//     const replacedValues = replaceUndefined(values);
//     const rows = await sqlHelpers.query<T>(sqlWithPrefix, ...replacedValues);
//     if (rows.length == 1) return rows[0];
//     return null;
//   };

//   return { ...sqlHelpers, execute, queryOne, insert };
// }

export interface UnitOfWork {
  users: UserRepo;
  sessions: SessionRepo;
  accounts: AccountRepo;
  verificationTokens: VerificationTokenRepo;
  sql: SqlTag;
}

export function buildUnitOfWork(sql: SqlTag, config?: Configuration): UnitOfWork {
  config ??= { verbose: false };
  config.prefix ??= "";
  config.verbose ??= false;

  //const esqlHelpers = buildExtendedSqlHelpers(sql, config);

  return {
    users: new UserRepo(sql, config),
    sessions: new SessionRepo(sql, config),
    accounts: new AccountRepo(sql, config),
    verificationTokens: new VerificationTokenRepo(sql, config),
    sql,
  };
}
