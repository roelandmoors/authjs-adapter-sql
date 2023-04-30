import { ExtendedSqlHelpers, convertDate } from "../db";
import { AdapterUser } from "next-auth/adapters";

export interface UserRecord {
  id: number;
  name: string | null | undefined;
  email: string;
  email_verified: Date | string | null;
  image: string | null | undefined;
  created_at: Date;
  updated_at: Date;
}

export function convertUser(userRecord: UserRecord): AdapterUser {
  return {
    id: userRecord.id.toString(),
    name: userRecord.name,
    email: userRecord.email,
    emailVerified: convertDate(userRecord.email_verified),
    image: userRecord.image,
  };
}

export class UserRepo {
  sql: ExtendedSqlHelpers;

  constructor(sql: ExtendedSqlHelpers) {
    this.sql = sql;
  }

  getById(id: number): Promise<UserRecord | null> {
    return this.sql.queryOne<UserRecord>("select * from users where id = ?", [id]);
  }

  getByEmail(email: string): Promise<UserRecord | null> {
    return this.sql.queryOne<UserRecord>("select * from users where email = ?", [email]);
  }

  async create(
    name?: string | null,
    image?: string | null,
    email?: string | null,
    emailVerified?: Date | null
  ): Promise<UserRecord | null> {
    const result = await this.sql.execute(
      "insert into users (name, image, email, email_verified, created_at, updated_at) " +
        "VALUES (?,?,?,?,NOW(),NOW())",
      [name, image, email, emailVerified]
    );

    return await this.getById(result.insertId);
  }

  deleteById(id: string) {
    return this.sql.execute("delete from users where id = ?", [id]);
  }

  async updateName(id: number, name?: string | null) {
    await this.sql.execute("update users set name = ? where id = ? ", [name, id]);
    return await this.getById(id);
  }
}
