import { SqlHelpers } from "../db";

import { customAlphabet, urlAlphabet } from 'nanoid';
import { AdapterUser } from "next-auth/adapters";

const nanoid = customAlphabet(urlAlphabet, 12);

export interface UserRecord {
    id: number
    public_id: string;
    name: string | null | undefined;
    email: string
    email_verified: Date | null;
    image: string | null | undefined;
    created_at: Date
    updated_at: Date
}

export function convertUser(userRecord: UserRecord): AdapterUser {    
    return {
        id: userRecord.public_id,
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

    getById(id: number): Promise<UserRecord | null> {
        return this.sql.queryOne<UserRecord>(
            "select * from users where id = ?",
            [id]);
    }

    getByPublicId(publicId: string): Promise<UserRecord | null> {
        return this.sql.queryOne<UserRecord>(
            "select * from users where public_id = ?",
            [publicId]);
    }

    getByEmail(email: string): Promise<UserRecord | null> {
        return this.sql.queryOne<UserRecord>(
            "select * from users where email = ?",
            [email]);
    }

    async create(name?:string | null, image?:string | null, email?:string | null, emailVerified?:Date | null): Promise<UserRecord | null> {
        const publicId = nanoid()
        const result = await this.sql.execute(
            "INSERT INTO users (public_id, name, image, email, email_verified, created_at, updated_at) " +
            "VALUES (?,?,?,?,?,NOW(),NOW())",
            [publicId, name, image, email, emailVerified],
        )
        return await this.getById(result.insertId);
    }
}