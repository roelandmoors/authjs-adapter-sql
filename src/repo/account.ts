import { SqlHelpers } from "../db";

export interface AccountRecord {
    id: bigint;
    user_id: bigint;
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

export function convertAccount(accountRecord: AccountRecord): any {    
    return {

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

}