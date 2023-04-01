import * as mysql from 'mysql2/promise';

import { runBasicTests } from "@next-auth/adapter-test";
import Mysql2Adapter from "../src";
import { buildUnitOfWork } from '../src/db';
import { convertUser } from '../src/repo/user';
import { convertVerificationToken } from '../src/repo/verification';
import { convertSession } from '../src/repo/session';
import { convertAccount } from '../src/repo/account';

function getConnection() : Promise<mysql.Connection> {
  return mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'authjs_test'
  });
}

const db = buildUnitOfWork(getConnection);

runBasicTests({
  adapter: Mysql2Adapter(getConnection),
  db: {
    connect: async () => {
      await db.raw.execute('truncate table users', [])
      await db.raw.execute('truncate table accounts', [])
      await db.raw.execute('truncate table sessions', [])
      await db.raw.execute('truncate table verification_tokens', [])
    },

    verificationToken: async (where) => {
      const token = await db.verificationTokens.getByToken(where.identifier, where.token);
      if (token == null) return null;
      return convertVerificationToken(token);
    },

    user: async (id) => {
      const userRecord = await db.users.getById(id);  
      if (userRecord == null) return null    
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
})
