import { VerificationToken } from "@auth/core/adapters";
import { Configuration, ExecuteResult } from "../types";
import { datetimeToUtcStr, createDate } from "../utils";
import { Logger, createLogger } from "../logger";
import { SqlTag } from "sql-tagged-template";

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
  sql: SqlTag;
  config: Configuration;
  logger: Logger;

  constructor(sql: SqlTag, config: Configuration) {
    this.sql = sql;
    this.config = config;
    this.logger = createLogger("verification", config.verbose);
  }

  getByToken(identifier: string, token: string): Promise<VerificationTokenRecord | null> {
    this.logger.info("getByToken", { identifier, token });
    return this.sql`select * from [TABLE_PREFIX]verification_tokens 
          where identifier =${identifier} and token = ${token}`.selectOne<VerificationTokenRecord>();
  }

  async create(identifier: string, token: string, expires: Date): Promise<VerificationTokenRecord | null> {
    this.logger.info("create", { identifier, token, expires });
    await this.sql`insert into [TABLE_PREFIX]verification_tokens (identifier, token, expires, created_at, updated_at) 
      VALUES (${identifier},${token},${datetimeToUtcStr(expires)},NOW(),NOW())`.query();
    return await this.getByToken(token, identifier);
  }

  deleteByToken(identifier: string, token: string): Promise<ExecuteResult> {
    this.logger.info("deleteByToken", { identifier, token });
    return this.sql`delete from [TABLE_PREFIX]verification_tokens 
      where identifier = ${identifier} and token = ${token}`.query();
  }
}
