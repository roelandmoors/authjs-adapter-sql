import { ResultSetHeader } from "mysql2";
import { VerificationToken } from "next-auth/adapters";
import { SqlHelpers } from "../db";

export interface VerificationTokenRecord {
    identifier: string;
    token: string;
    expires: Date;
    created_at: Date;
    updated_at: Date;
}

export function convertVerificationToken(tokenRecord: VerificationTokenRecord): VerificationToken {
    return {
       identifier: tokenRecord.identifier,
       token: tokenRecord.token,
       expires: tokenRecord.expires
    };
}

export class VerificationTokenRepo {
    sql: SqlHelpers;

    constructor(sql:SqlHelpers) {
        this.sql = sql;
    }

    getById(id:number) : Promise<VerificationTokenRecord | null> {
        return this.sql.queryOne<VerificationTokenRecord>(
            "select * from sessions where id = ?", 
            [id]);
    }

    getByToken(identifier:string, token:string) : Promise<VerificationTokenRecord | null> {
        return this.sql.queryOne<VerificationTokenRecord>(
            "select * from sessions where identifier = ? and token = ?", 
            [identifier, token]);
    }

    deleteByToken(identifier: string, token: string) : Promise<ResultSetHeader> {
        return this.sql.execute(
            "delete from verification_tokens where identifier = ? and token = ?",
            [identifier, token])
      }
}