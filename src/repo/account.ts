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