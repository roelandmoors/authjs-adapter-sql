import { ResultSetHeader } from "mysql2/promise";
import { SqlHelpers } from "../db";

export interface SessionRecord {
    id: number;
    user_id: string;
    expires: Date;
    session_token: string
    created_at: Date
    updated_at: Date
}

export function convertSession(rec: SessionRecord): any {    
    return {
        id: rec.id,
        userId: rec.user_id,
        expires: rec.expires,
        sessionToken: rec.session_token
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
    
    async create(userId:string, sessionToken:string, expires:Date): Promise<SessionRecord | null> {
        const result = await this.sql.execute(
            "insert into sessions (user_id, expires, session_token, created_at, updated_at) " +
            "VALUES (?,?,?,NOW(),NOW())",
            [userId, expires, sessionToken],
        )
        return await this.getById(result.insertId);
    }

    async updateExpires(sessionToken: string, expires?: Date): Promise<SessionRecord | null> {
        const result = await this.sql.execute(
            "update sessions set expires = ? where session_token = ? ",
            [expires, sessionToken],
        )
        return await this.getById(result.insertId);
      }
  
}