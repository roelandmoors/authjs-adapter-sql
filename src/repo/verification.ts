import { VerificationToken } from "@auth/core/adapters";
import { Configuration, ExecuteResult, ExtendedSqlHelpers } from "../types";
import { datetimeToUtcStr, parseUtcDate } from "../utils";

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
    expires: parseUtcDate(tokenRecord.expires) ?? new Date(),
  };
}

export class VerificationTokenRepo {
  sql: ExtendedSqlHelpers;
  config: Configuration;

  constructor(sql: ExtendedSqlHelpers, config: Configuration) {
    this.sql = sql;
    this.config = config;
  }

  getByToken(identifier: string, token: string): Promise<VerificationTokenRecord | null> {
    return this.sql.queryOne<VerificationTokenRecord>`select * from [TABLE_PREFIX]verification_tokens 
          where identifier =${identifier} and token = ${token}`;
  }

  async create(identifier: string, token: string, expires: Date): Promise<VerificationTokenRecord | null> {
    await this.sql
      .execute`insert into [TABLE_PREFIX]verification_tokens (identifier, token, expires, created_at, updated_at) 
      VALUES (${identifier},${token},${datetimeToUtcStr(expires)},NOW(),NOW())`;
    return await this.getByToken(token, identifier);
  }

  deleteByToken(identifier: string, token: string): Promise<ExecuteResult> {
    return this.sql.execute`delete from [TABLE_PREFIX]verification_tokens 
      where identifier = ${identifier} and token = ${token}`;
  }
}
