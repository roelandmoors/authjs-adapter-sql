import { SqlHelpers } from "../db";

import { customAlphabet, urlAlphabet } from 'nanoid';
import { AdapterUser } from "next-auth/adapters";

const nanoid = customAlphabet(urlAlphabet, 12);

export interface UserRecord {
    id: string
    name: string | null | undefined;
    email: string
    email_verified: Date | null;
    image: string | null | undefined;
    created_at: Date
    updated_at: Date
}

export function convertUser(userRecord: UserRecord): AdapterUser {    
    console.log({userRecord})
    return {
        id: userRecord.id,
        name: userRecord.name,
        email: userRecord.email,
        emailVerified: userRecord.email_verified,
        image: userRecord.image
    };
}

export class UserRepo {
    sql: SqlHelpers;

    constructor(sql: SqlHelpers) {
        this.sql = sql;
    }

    getById(id: string): Promise<UserRecord | null> {
        return this.sql.queryOne<UserRecord>(
            "select * from users where id = ?",
            [id]);
    }

    getByEmail(email: string): Promise<UserRecord | null> {
        return this.sql.queryOne<UserRecord>(
            "select * from users where email = ?",
            [email]);
    }

    async create(name?:string | null, image?:string | null, email?:string | null, emailVerified?:Date | null): Promise<UserRecord | null> {
        const id = nanoid()
        await this.sql.execute(
            "insert into users (id, name, image, email, email_verified, created_at, updated_at) " +
            "VALUES (?,?,?,?,?,NOW(),NOW())",
            [id, name, image, email, emailVerified],
        )
        return await this.getById(id);
    }
}