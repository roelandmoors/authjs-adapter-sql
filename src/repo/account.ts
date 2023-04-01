import { SqlHelpers } from "../db";

export interface AccountRecord {
    id: number;
    user_id: string;
    type: string;
    provider: string;
    provider_account_id: string;
    refresh_token?: string | null;
    expires_at?: number;
    token_type?: string;
    scope?: string;
    id_token?: string;
    session_state?: string;
    oauth_token_secret?: string;
    oauth_token?: string;
    created_at: Date;
    updated_at: Date;
}

export function convertAccount(rec: AccountRecord): any {
    return {
        id: rec.id,
        userId: rec.user_id,
        type: rec.type,
        provider: rec.provider,
        providerAccountId: rec.provider_account_id,
        refreshToken: rec.refresh_token,
        expiresAt: rec.expires_at,
        tokenType: rec.token_type,
        scope: rec.scope,
        idToken: rec.id_token,
        sessionState: rec.session_state,
        oauthTokenSecret: rec.oauth_token_secret,
        oauthToken: rec.oauth_token,
    };
}

export class AccountRepo {
    sql: SqlHelpers;

    constructor(sql: SqlHelpers) {
        this.sql = sql;
    }

    getById(id: number): Promise<AccountRecord | null> {
        return this.sql.queryOne<AccountRecord>(
            "select * from accounts where id = ?",
            [id]);
    }

    getByProvider(provider: string, providerAccountId: string): Promise<AccountRecord | null> {
        return this.sql.queryOne<AccountRecord>(
            "select * from accounts where provider = ? and provider_account_id = ?",
            [provider, providerAccountId]);
    }

    deleteByProvider(provider: string, providerAccountId: string) {
        return this.sql.execute(
            "delete from accounts where provider = ? and provider_account_id = ?",
            [provider, providerAccountId])
    }

    deleteByUserId(userId: string) {
        return this.sql.execute(
            "delete from accounts where user_id = ?",
            [userId])
    }

    async create(rec: Omit<AccountRecord, "id">): Promise<AccountRecord | null> {
        const result = await this.sql.execute(
            "insert into accounts (user_id, type, provider, provider_account_id, refresh_token, expires_at, token_type, scope, id_token, session_state, oauth_token_secret, oauth_token, created_at, updated_at ) " +
            "VALUES (?,?,?,?,?,?,?,?,?,?,?,?,NOW(),NOW())",
            [rec.user_id, rec.type, rec.provider, rec.provider_account_id, rec.refresh_token, rec.expires_at, rec.token_type, rec.scope, rec.id_token, rec.session_state, rec.oauth_token_secret, rec.oauth_token],
        )
        return await this.getById(result.insertId);
    }
}


