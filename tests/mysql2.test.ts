import * as mysql from "mysql2/promise";

import { runBasicTests } from "@next-auth/adapter-test";
import SqlAdapter from "../src";
import { buildUnitOfWork } from "../src/db";
import { convertUser } from "../src/repo/user";
import { convertVerificationToken } from "../src/repo/verification";
import { convertSession } from "../src/repo/session";
import { convertAccount } from "../src/repo/account";
import buildMysql2Helpers from "../src/mysql2";

function getConnection() {
  return mysql.createConnection({
    host: "127.0.0.1",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE || "authjs_test",
  });
}

const mysqlHelpers = buildMysql2Helpers(getConnection);

const db = buildUnitOfWork(mysqlHelpers);

runBasicTests({
  adapter: SqlAdapter(mysqlHelpers),
  db: {
    connect: async () => {
      await db.raw.execute("truncate table users", []);
      await db.raw.execute("truncate table accounts", []);
      await db.raw.execute("truncate table sessions", []);
      await db.raw.execute("truncate table verification_tokens", []);
    },

    verificationToken: async (where) => {
      const token = await db.verificationTokens.getByToken(where.identifier, where.token);
      if (token == null) return null;
      return convertVerificationToken(token);
    },

    user: async (id) => {
      const userRecord = await db.users.getById(Number(id));
      if (userRecord == null) return null;
      return convertUser(userRecord);
    },

    account: async (where) => {
      const account = await db.accounts.getByProvider(where.provider, where.providerAccountId);
      if (account == null) return null;
      return convertAccount(account);
    },

    session: async (sessionToken) => {
      const session = await db.sessions.getByToken(sessionToken);
      if (session == null) return null;
      return convertSession(session);
    },
  },
});
