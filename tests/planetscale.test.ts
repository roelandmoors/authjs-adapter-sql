require("dotenv").config();
import { Client } from "@planetscale/database";
import fetch from "node-fetch";

import { runBasicTests } from "@next-auth/adapter-test";
import Mysql2Adapter from "../src";
import { buildUnitOfWork } from "../src/db";
import { convertUser } from "../src/repo/user";
import { convertVerificationToken } from "../src/repo/verification";
import { convertSession } from "../src/repo/session";
import { convertAccount } from "../src/repo/account";
import buildPlanetScaleHelpers from "../src/planetscale";

const config = {
  fetch: fetch,
  host: "aws.connect.psdb.cloud",
  username: process.env.PLANETSCALE_USERNAME,
  password: process.env.PLANETSCALE_PASSWORD,
};

const client = new Client(config);

const helpers = buildPlanetScaleHelpers(client);

const db = buildUnitOfWork(helpers);

runBasicTests({
  adapter: Mysql2Adapter(helpers),
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
      const userRecord = await db.users.getById(id);
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
