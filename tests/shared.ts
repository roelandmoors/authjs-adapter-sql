import { convertUser } from "../src/repo/user";
import { convertVerificationToken } from "../src/repo/verification";
import { convertSession } from "../src/repo/session";
import { convertAccount } from "../src/repo/account";
import { UnitOfWork } from "../src/db";

export default function dbTests(db: UnitOfWork) {
  return {
    connect: async () => {
      await db.sql`truncate table [TABLE_PREFIX]users`.query();
      await db.sql`truncate table [TABLE_PREFIX]accounts`.query();
      await db.sql`truncate table [TABLE_PREFIX]sessions`.query();
      await db.sql`truncate table [TABLE_PREFIX]verification_tokens`.query();
    },

    verificationToken: async (where: { identifier: string; token: string }) => {
      const token = await db.verificationTokens.getByToken(where.identifier, where.token);
      if (token == null) return null;
      return convertVerificationToken(token);
    },

    user: async (id: string) => {
      const userRecord = await db.users.getById(Number(id));
      if (userRecord == null) return null;
      return convertUser(userRecord);
    },

    account: async (where: { provider: string; providerAccountId: string }) => {
      const account = await db.accounts.getByProvider(where.provider, where.providerAccountId);
      if (account == null) return null;
      return convertAccount(account);
    },

    session: async (sessionToken: string) => {
      const session = await db.sessions.getByToken(sessionToken);
      if (session == null) return null;
      return convertSession(session);
    },
  };
}
