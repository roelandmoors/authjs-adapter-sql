import { User } from "next-auth";
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
    return this.sql.queryOne<UserRecord>`select * from users where id = ${id}`;
  }

  getByEmail(email: string): Promise<UserRecord | null> {
    return this.sql.queryOne<UserRecord>`select * from users where email = ${email}`;
  }

  async create(user: Omit<User, "id">): Promise<UserRecord | null> {
    let sqlFields = ["created_at", "updated_at"];
    let params = ["NOW()", "NOW()"];
    let values = [];
    for (const [field, value] of Object.entries(user)) {
      sqlFields.push(toSnakeCase(field));
      params.push("?");
      values.push(value);
    }

    console.log({ sqlFields, params, values });

    const result = await this.sql.execute(
      `insert into users (${sqlFields.join(",")}) VALUES (${params.join(",")})`,
      values
    );

    return await this.getById(result.insertId);
  }

  deleteById(id: string) {
    return this.sql.execute`delete from users where id = ${id}`;
  }

  async updateUser(user: User) {
    const id = Number(user.id);

    let sqlFields = [];
    let values = [];
    for (const [field, value] of Object.entries(user)) {
      if (field === "id") continue;
      sqlFields.push(toSnakeCase(field));
      values.push(value);
    }
    values.push(id);
    const updateSql = sqlFields.map((f) => f + " = ?").join(",");

    await this.sql.execute(`update users set ${updateSql} where id = ? `, values);
    return await this.getById(id);
  }
}

function toSnakeCase(value: string): string {
  return value
    .split(/\.?(?=[A-Z])/)
    .join("_")
    .toLowerCase();
}
