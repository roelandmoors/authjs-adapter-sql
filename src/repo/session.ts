import { Logger, createLogger } from "../logger";
import { Configuration, ExtendedSqlHelpers } from "../types";
import { datetimeToUtcStr, createDate } from "../utils";

export interface SessionRecord {
  id: number;
  user_id: number;
  expires: string;
  session_token: string;
  created_at: Date;
  updated_at: Date;
}

export function convertSession(rec: SessionRecord): any {
  return {
    id: rec.id,
    userId: rec.user_id.toString(),
    expires: createDate(rec.expires),
    sessionToken: rec.session_token,
  };
}

export class SessionRepo {
  sql: ExtendedSqlHelpers;
  config: Configuration;
  logger: Logger;

  constructor(sql: ExtendedSqlHelpers, config: Configuration) {
    this.sql = sql;
    this.config = config;
    this.logger = createLogger("session", config.verbose);
  }

  getById(id: number): Promise<SessionRecord | null> {
    this.logger.info("getById", { id });
    return this.sql.queryOne<SessionRecord>`select * from [TABLE_PREFIX]sessions where id = ${id}`;
  }

  getByToken(token: string): Promise<SessionRecord | null> {
    this.logger.info("getByToken", { token });
    return this.sql.queryOne<SessionRecord>`select * from [TABLE_PREFIX]sessions where session_token = ${token}`;
  }

  async deleteByUserId(userId: string): Promise<void> {
    this.logger.info("deleteByUserId", { userId });
    await this.sql.execute`delete from [TABLE_PREFIX]sessions where user_id = ${userId}`;
  }

  async deleteByToken(token: string): Promise<void> {
    this.logger.info("deleteByToken", { token });
    await this.sql.execute`delete from [TABLE_PREFIX]sessions where session_token = ${token}`;
  }

  async create(userId: string, sessionToken: string, expires: Date): Promise<SessionRecord | null> {
    this.logger.info("create", { userId, sessionToken, expires });
    const result = await this.sql.insert`insert into [TABLE_PREFIX]sessions 
      (user_id, expires, session_token, created_at, updated_at) 
      VALUES (${userId},${datetimeToUtcStr(expires)},${sessionToken},NOW(),NOW())`;
    return await this.getById(result.insertId);
  }

  async updateExpires(sessionToken: string, expires?: Date): Promise<SessionRecord | null> {
    this.logger.info("updateExpires", { sessionToken, expires });
    const result = await this.sql.execute`update [TABLE_PREFIX]sessions set expires = ${datetimeToUtcStr(
      expires
    )} where session_token = ${sessionToken} `;
    return await this.getById(result.insertId);
  }
}
