import { AdapterAccount } from "next-auth/adapters";
import { ProviderType } from "next-auth/providers";
import { ExtendedSqlHelpers } from "../db";

export interface AccountRecord {
  id: number;
  user_id: string;
  type: ProviderType;
  provider: string;
  provider_account_id: string;
  access_token?: string;
  refresh_token?: string;
  expires_at?: number | string;
  token_type?: string;
  scope?: string;
  id_token?: string;
  session_state?: string;
  oauth_token_secret?: string;
  oauth_token?: string;
  created_at: Date;
  updated_at: Date;
}

export function convertAccount(rec: AccountRecord): AdapterAccount {
  return {
    id: rec.id,
    userId: rec.user_id,
    type: rec.type,
    provider: rec.provider,
    providerAccountId: rec.provider_account_id,
    access_token: rec.access_token,
    refresh_token: rec.refresh_token,
    expires_at: Number(rec.expires_at),
    token_type: rec.token_type,
    scope: rec.scope,
    id_token: rec.id_token,
    session_state: rec.session_state,
  };
}

export class AccountRepo {
  sql: ExtendedSqlHelpers;

  constructor(sql: ExtendedSqlHelpers) {
    this.sql = sql;
  }

  getById(id: bigint): Promise<AccountRecord | null> {
    return this.sql.queryOne<AccountRecord>("select * from accounts where id = ?", [id]);
  }

  getByProvider(provider: string, providerAccountId: string): Promise<AccountRecord | null> {
    return this.sql.queryOne<AccountRecord>("select * from accounts where provider = ? and provider_account_id = ?", [
      provider,
      providerAccountId,
    ]);
  }

  deleteByProvider(provider: string, providerAccountId: string) {
    return this.sql.execute("delete from accounts where provider = ? and provider_account_id = ?", [
      provider,
      providerAccountId,
    ]);
  }

  deleteByUserId(userId: string) {
    return this.sql.execute("delete from accounts where user_id = ?", [userId]);
  }

  async create(
    rec: Omit<AccountRecord, "id" | "oauth_token_secret" | "oauth_token" | "created_at" | "updated_at">
  ): Promise<AccountRecord | null> {
    const result = await this.sql.execute(
      "insert into accounts (user_id, type, provider, provider_account_id, access_token, refresh_token, expires_at, token_type, scope, id_token, session_state, created_at, updated_at ) " +
        "VALUES (?,?,?,?,?,?,?,?,?,?,?,NOW(),NOW())",
      [
        rec.user_id,
        rec.type,
        rec.provider,
        rec.provider_account_id,
        rec.access_token,
        rec.refresh_token,
        rec.expires_at,
        rec.token_type,
        rec.scope,
        rec.id_token,
        rec.session_state,
      ]
    );
    return await this.getById(result.insertId);
  }
}
