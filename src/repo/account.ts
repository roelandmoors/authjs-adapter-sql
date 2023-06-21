import { AdapterAccount } from "@auth/core/adapters";
import { ProviderType } from "@auth/core/providers";
import { Configuration } from "../types";
import { Logger, createLogger } from "../logger";
import { SqlTag } from "sql-tagged-template";

export interface AccountRecord {
  id: number;
  user_id: number;
  type: Extract<ProviderType, "oauth" | "oidc" | "email">;
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
    userId: rec.user_id.toString(),
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
  sql: SqlTag;
  config: Configuration;
  logger: Logger;

  constructor(sql: SqlTag, config: Configuration) {
    this.sql = sql;
    this.config = config;
    this.logger = createLogger("account", config.verbose);
  }

  getById(id: number): Promise<AccountRecord | null> {
    this.logger.info("getById", { id });
    return this.sql`select * from [TABLE_PREFIX]accounts where id = ${id}`.selectOne<AccountRecord>();
  }

  getByProvider(provider: string, providerAccountId: string): Promise<AccountRecord | null> {
    this.logger.info("getByProvider", { provider, providerAccountId });
    return this.sql`
      select * from [TABLE_PREFIX]accounts 
      where provider = ${provider} and provider_account_id = ${providerAccountId}`.selectOne<AccountRecord>();
  }

  deleteByProvider(provider: string, providerAccountId: string) {
    this.logger.info("deleteByProvider", { provider, providerAccountId });
    return this.sql`delete from [TABLE_PREFIX]accounts 
        where provider = ${provider} and provider_account_id = ${providerAccountId}`.query();
  }

  deleteByUserId(userId: string) {
    this.logger.info("deleteByUserId", { userId });
    return this.sql`delete from [TABLE_PREFIX]accounts where user_id = ${userId}`.query();
  }

  async create(
    rec: Omit<AccountRecord, "id" | "oauth_token_secret" | "oauth_token" | "created_at" | "updated_at">
  ): Promise<AccountRecord | null> {
    this.logger.info("create", { rec });
    const insertId = await this.sql`insert into [TABLE_PREFIX]accounts 
        (user_id, type, provider, provider_account_id, access_token, refresh_token, expires_at, token_type, scope, id_token, session_state, created_at, updated_at ) 
        VALUES (${rec.user_id},${rec.type},${rec.provider},${rec.provider_account_id},${rec.access_token},${rec.refresh_token},${rec.expires_at},${rec.token_type},${rec.scope},${rec.id_token},${rec.session_state},NOW(),NOW())`.insert();
    return await this.getById(insertId);
  }
}
