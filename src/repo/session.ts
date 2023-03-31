import { SqlHelpers } from "../db";

export interface SessionRecord {
    id: bigint;
    user_id: bigint;
    expires: Date;
    session_token: string
    created_at: Date
    updated_at: Date
}

export class SessionRepo {
    sql: SqlHelpers;

    constructor(sql:SqlHelpers) {
        this.sql = sql;
    }

    getById(id:number) : Promise<SessionRepo | null> {
        return this.sql.queryOne<SessionRepo>(
            "select * from sessions where id = ?", 
            [id]);
    }

}