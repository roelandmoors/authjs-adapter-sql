import { VerificationToken } from "@auth/core/adapters";
import { Configuration, ExecuteResult, ExtendedSqlHelpers } from "../types";
import { datetimeToUtcStr, createDate } from "../utils";
import { Logger, createLogger } from "../logger";

export interface VerificationTokenRecord {
  identifier: string;
  token: string;
  expires: Date;
  created_at: Date;
  updated_at: Date;
}

export function convertVerificationToken(tokenRecord: VerificationTokenRecord): VerificationToken {
  return {
    identifier: tokenRecord.identifier,
    token: tokenRecord.token,
    expires: createDate(tokenRecord.expires) ?? new Date(),
  };
}

export class VerificationTokenRepo {
  sql: ExtendedSqlHelpers;
  config: Configuration;
  logger: Logger;

  constructor(sql: ExtendedSqlHelpers, config: Configuration) {
    this.sql = sql;
    this.config = config;
    this.logger = createLogger("verification", config.verbose);
  }

  getByToken(identifier: string, token: string): Promise<VerificationTokenRecord | null> {
    this.logger.info("getByToken", { identifier, token });
    return this.sql.queryOne<VerificationTokenRecord>`select * from [TABLE_PREFIX]verification_tokens 
          where identifier =${identifier} and token = ${token}`;
  }

  async create(identifier: string, token: string, expires: Date): Promise<VerificationTokenRecord | null> {
    this.logger.info("create", { identifier, token, expires });
    await this.sql
      .execute`insert into [TABLE_PREFIX]verification_tokens (identifier, token, expires, created_at, updated_at) 
      VALUES (${identifier},${token},${datetimeToUtcStr(expires)},NOW(),NOW())`;
    return await this.getByToken(token, identifier);
  }

  deleteByToken(identifier: string, token: string): Promise<ExecuteResult> {
    this.logger.info("deleteByToken", { identifier, token });
    return this.sql.execute`delete from [TABLE_PREFIX]verification_tokens 
      where identifier = ${identifier} and token = ${token}`;
  }
}
