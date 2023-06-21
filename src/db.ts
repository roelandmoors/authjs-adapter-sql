import { SqlTag } from "sql-tagged-template";
import { AccountRepo } from "./repo/account";
import { SessionRepo } from "./repo/session";
import { UserRepo } from "./repo/user";
import { VerificationTokenRepo } from "./repo/verification";
import { Configuration, Primitive } from "./types";
import { replacePrefix } from "./utils";

export interface UnitOfWork {
  users: UserRepo;
  sessions: SessionRepo;
  accounts: AccountRepo;
  verificationTokens: VerificationTokenRepo;
  sql: SqlTag;
}

export function buildUnitOfWork(sqlTag: SqlTag, config?: Configuration): UnitOfWork {
  config ??= { verbose: false };
  config.prefix ??= "";
  config.verbose ??= false;
  config.prefix ??= undefined;

  const sql = (stringTemplate: readonly string[], ...parms: Primitive[]) => {
    const sqlWithPrefix = replacePrefix(stringTemplate, config?.prefix);
    return sqlTag(sqlWithPrefix, ...parms);
  };

  return {
    users: new UserRepo(sql, config),
    sessions: new SessionRepo(sql, config),
    accounts: new AccountRepo(sql, config),
    verificationTokens: new VerificationTokenRepo(sql, config),
    sql,
  };
}
