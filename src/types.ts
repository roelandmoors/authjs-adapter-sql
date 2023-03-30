
export interface UserRecord {
    id: bigint
    public_id: string;
    name: string;
    email: string
    email_verified: Date;
    image: string
    created_at: Date
    updated_at: Date
}

export interface SessionRecord {
    id: bigint;
    user_id: bigint;
    expires: Date;
    session_token: string
    created_at: Date
    updated_at: Date
}

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

export interface VerificationTokenRecord {
    identifier: string;
    token: string;
    expires: Date;
    created_at: Date;
    updated_at: Date;
}
