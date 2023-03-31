import { SqlHelpers } from "../db";

export interface AccountRecord {
    id: number;
    user_id: string;
    type: string;
    provider: string;
    provider_account_id: string;
    refresh_token: string;
    expires_at: number;
    token_type: string;
    scope: string;
    id_token: string;
    session_state: string;
    oauth_token_secret: string;
    oauth_token: string;
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

    constructor(sql:SqlHelpers) {
        this.sql = sql;
    }

    getById(id:number) : Promise<AccountRecord | null> {
        return this.sql.queryOne<AccountRecord>(
            "select * from accounts where id = ?", 
            [id]);
    }

    getByProvider(provider:string, providerAccountId:string) : Promise<AccountRecord | null> {
        return this.sql.queryOne<AccountRecord>(
            "select * from accounts where provider = ? and provider_account_id = ?", 
            [provider, providerAccountId]);
    }

    delete(provider: string, providerAccountId: string) {
        return this.sql.execute(
            "delete from accounts where provider = ? and provider_account_id = ?",
            [provider, providerAccountId])
      }

}