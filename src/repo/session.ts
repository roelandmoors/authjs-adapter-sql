
export interface SessionRecord {
    id: bigint;
    user_id: bigint;
    expires: Date;
    session_token: string
    created_at: Date
    updated_at: Date
}