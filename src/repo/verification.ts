import { VerificationToken } from "next-auth/adapters";
import { ExecuteResult, ExtendedSqlHelpers, convertDate } from "../db";

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
    expires: convertDate(tokenRecord.expires) ?? new Date(),
  };
}

export class VerificationTokenRepo {
  sql: ExtendedSqlHelpers;

  constructor(sql: ExtendedSqlHelpers) {
    this.sql = sql;
  }

  getByToken(identifier: string, token: string): Promise<VerificationTokenRecord | null> {
    return this.sql.queryOne<VerificationTokenRecord>(
      "select * from verification_tokens where identifier = ? and token = ?",
      [identifier, token]
    );
  }

  async create(identifier: string, token: string, expires: Date): Promise<VerificationTokenRecord | null> {
    await this.sql.execute(
      "insert into verification_tokens (identifier, token, expires, created_at, updated_at) " +
        "VALUES (?,?,?,NOW(),NOW())",
      [identifier, token, expires]
    );
    return await this.getByToken(token, identifier);
  }

  deleteByToken(identifier: string, token: string): Promise<ExecuteResult> {
    return this.sql.execute("delete from verification_tokens where identifier = ? and token = ?", [identifier, token]);
  }
}
