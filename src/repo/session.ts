import { SqlHelpers } from "../db";

export interface SessionRecord {
    id: number;
    user_id: number;
    expires: Date;
    session_token: string
    created_at: Date
    updated_at: Date
}

export function convertSession(sessionRecord: SessionRecord): any {    
    return {

    };
}

export class SessionRepo {
    sql: SqlHelpers;

    constructor(sql:SqlHelpers) {
        this.sql = sql;
    }

    getById(id:number) : Promise<SessionRecord | null> {
        return this.sql.queryOne<SessionRecord>(
            "select * from sessions where id = ?", 
            [id]);
    }

    getByToken(token:string) : Promise<SessionRecord | null> {
        return this.sql.queryOne<SessionRecord>(
            "select * from sessions where session_token = ?", 
            [token]);
    }

}