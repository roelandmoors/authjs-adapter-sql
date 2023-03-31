import { SqlHelpers } from "../db";

import { customAlphabet, urlAlphabet } from 'nanoid';

const nanoid = customAlphabet(urlAlphabet, 12);

export interface UserRecord {
    id: bigint
    public_id: string;
    name: string | null | undefined;
    email: string
    email_verified: Date | null;
    image: string | null | undefined;
    created_at: Date
    updated_at: Date
}

export class UserRepo {
    sql: SqlHelpers;

    constructor(sql:SqlHelpers) {
        this.sql = sql;
    }

    getById(id:number) : Promise<UserRecord | null> {
        return this.sql.queryOne<UserRecord>(
            "select * from users where id = ?", 
            [id]);
    }

    getByPublicId(publicId:string) : Promise<UserRecord | null> {
        return this.sql.queryOne<UserRecord>(
            "select * from users where public_id = ?", 
            [publicId]);
    }    

    getByEmail(email:string) : Promise<UserRecord | null> {
        return this.sql.queryOne<UserRecord>(
            "select * from users where email = ?", 
            [email]);
    }   

    async create(user : Omit<UserRecord, "id" | "created_at" | "updated_at" | "public_id">) : Promise<UserRecord | null> {
        const publicId = nanoid()
        const userId = await this.sql.execute(
            "INSERT INTO users (public_id, name, image, email, email_verified, created_at, updated_at) " +
            "VALUES (?,?,?,?,?,NOW(),NOW())",
            [publicId, user.name, user.image, user.email, user.email_verified],
          )
        return await this.getById(userId);
    }
}