import { Configuration, ExtendedSqlHelpers } from "../types";
import { datetimeToStr, parseDate } from "../utils";

export interface SessionRecord {
  id: number;
  user_id: number;
  expires: Date;
  session_token: string;
  created_at: Date;
  updated_at: Date;
}

export function convertSession(rec: SessionRecord): any {
  return {
    id: rec.id,
    userId: rec.user_id.toString(),
    expires: parseDate(rec.expires),
    sessionToken: rec.session_token,
  };
}

export class SessionRepo {
  sql: ExtendedSqlHelpers;
  config: Configuration;

  constructor(sql: ExtendedSqlHelpers, config: Configuration) {
    this.sql = sql;
    this.config = config;
  }

  getById(id: number): Promise<SessionRecord | null> {
    return this.sql.queryOne<SessionRecord>`select * from [TABLE_PREFIX]sessions where id = ${id}`;
  }

  getByToken(token: string): Promise<SessionRecord | null> {
    return this.sql.queryOne<SessionRecord>`select * from [TABLE_PREFIX]sessions where session_token = ${token}`;
  }

  async deleteByUserId(userId: string): Promise<void> {
    await this.sql.execute`delete from [TABLE_PREFIX]sessions where user_id = ${userId}`;
  }

  async deleteByToken(token: string): Promise<void> {
    await this.sql.execute`delete from [TABLE_PREFIX]sessions where session_token = ${token}`;
  }

  async create(userId: string, sessionToken: string, expires: Date): Promise<SessionRecord | null> {
    const result = await this.sql.insert`insert into [TABLE_PREFIX]sessions 
      (user_id, expires, session_token, created_at, updated_at) 
      VALUES (${userId},${datetimeToStr(expires)},${sessionToken},NOW(),NOW())`;
    return await this.getById(result.insertId);
  }

  async updateExpires(sessionToken: string, expires?: Date): Promise<SessionRecord | null> {
    const result = await this.sql.execute`update [TABLE_PREFIX]sessions set expires = ${datetimeToStr(
      expires
    )} where session_token = ${sessionToken} `;
    return await this.getById(result.insertId);
  }
}
