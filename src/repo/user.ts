import { User } from "@auth/core/types";
import { Configuration, ExtendedSqlHelpers } from "../types";
import { AdapterUser } from "@auth/core/adapters";
import { datetimeToUtcStr, isNumeric, createDate } from "../utils";
import { Logger, createLogger } from "../logger";

export interface UserRecord {
  id: number;
  name: string | null | undefined;
  email: string;
  email_verified: string | null;
  image: string | null | undefined;
  created_at: Date;
  updated_at: Date;
}

export function convertUser(userRecord: UserRecord): AdapterUser {
  return {
    id: userRecord.id.toString(),
    name: userRecord.name,
    email: userRecord.email,
    emailVerified: createDate(userRecord.email_verified),
    image: userRecord.image,
  };
}

export class UserRepo {
  sql: ExtendedSqlHelpers;
  config: Configuration;
  logger: Logger;

  constructor(sql: ExtendedSqlHelpers, config: Configuration) {
    this.sql = sql;
    this.config = config;
    this.logger = createLogger("user", config.verbose);
  }

  async getByStringId(id: string): Promise<UserRecord | null> {
    this.logger.info("getByStringId", { id });
    if (!isNumeric(id)) return null;
    return await this.getById(Number(id));
  }

  getById(id: number): Promise<UserRecord | null> {
    this.logger.info("getById", { id });
    return this.sql.queryOne<UserRecord>`select * from [TABLE_PREFIX]users where id = ${id}`;
  }

  getByEmail(email: string): Promise<UserRecord | null> {
    this.logger.info("getByEmail", { email });
    return this.sql.queryOne<UserRecord>`select * from [TABLE_PREFIX]users where email = ${email}`;
  }

  async create(user: Omit<User, "id">): Promise<UserRecord | null> {
    this.logger.info("create", { user });
    let sqlFields = ["created_at", "updated_at"];
    let params = [];
    let values = [];
    for (const [field, value] of Object.entries(user)) {
      sqlFields.push(toSnakeCase(field));
      params.push(",");
      if ((value as any) instanceof Date) {
        values.push(datetimeToUtcStr(value as any));
      } else {
        values.push(value);
      }
    }
    params.pop();

    const sql: string[] = [];
    sql.push(`insert into [TABLE_PREFIX]users (${sqlFields.join(",")}) VALUES (NOW(), NOW(),`);
    sql.push(...params);
    sql.push(")");

    const result = await this.sql.insert(sql, ...values);

    return await this.getById(result.insertId);
  }

  deleteById(id: string) {
    this.logger.info("deleteById", { id });
    return this.sql.execute`delete from [TABLE_PREFIX]users where id = ${id}`;
  }

  async updateUser(user: User) {
    this.logger.info("updateUser", { user });
    const id = Number(user.id);

    let sqlFields = [];
    let values = [];
    for (const [field, value] of Object.entries(user)) {
      if (field === "id") continue;
      sqlFields.push(toSnakeCase(field));
      values.push(value);
    }
    values.push(id);
    let updateSql = sqlFields.map((f) => f + " = ?").join(",");
    updateSql = `update [TABLE_PREFIX]users set ${updateSql} where id = ? `;

    await this.sql.execute(updateSql.split("?"), ...values);
    return await this.getById(id);
  }
}

function toSnakeCase(value: string): string {
  return value
    .split(/\.?(?=[A-Z])/)
    .join("_")
    .toLowerCase();
}
