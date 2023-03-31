import { ResultSetHeader } from "mysql2/promise";
import { SqlHelpers } from "../db";

export interface SessionRecord {
    id: number;
    user_public_id: number;
    expires: Date;
    session_token: string
    created_at: Date
    updated_at: Date
}

export function convertSession(sessionRecord: SessionRecord): any {    
    return {
        userId: sessionRecord.user_public_id
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

    deleteByToken(token: string): Promise<ResultSetHeader> {
        return this.sql.execute(
            "delete from sessions where session_token = ?",
            [token])
    }  
    
    async create(userPublicId:string, sessionToken:string, expires:Date): Promise<SessionRecord | null> {
        const result = await this.sql.execute(
            "INSERT INTO sessions (user_public_id, expires, session_token, created_at, updated_at) " +
            "VALUES (?,?,?,NOW(),NOW())",
            [userPublicId, expires, sessionToken],
        )
        return await this.getById(result.insertId);
    }
}