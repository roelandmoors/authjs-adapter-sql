import type { Adapter } from "next-auth/adapters";
import { SqlHelpers, buildUnitOfWork } from "./db";
import { convertUser } from "./repo/user";
import { convertVerificationToken } from "./repo/verification";
import { convertSession } from "./repo/session";

export default function Mysql2Adapter(sqlHelpers: SqlHelpers): Adapter {
  const db = buildUnitOfWork(sqlHelpers);

  return {
    async createUser(user) {
      const userRecord = await db.users.create(user.name, user.image, user.email, user.emailVerified);
      if (userRecord == null) throw new Error("creaing user failed!");
      return convertUser(userRecord);
    },

    async getUser(id) {
      const userRecord = await db.users.getById(id);
      if (userRecord == null) return null;
      return convertUser(userRecord);
    },

    async getUserByEmail(email) {
      const userRecord = await db.users.getByEmail(email);
      if (userRecord == null) return null;
      return convertUser(userRecord);
    },

    async getUserByAccount({ provider, providerAccountId }) {
      const account = await db.accounts.getByProvider(provider, providerAccountId);
      if (account == null) return null;
      const user = await db.users.getById(account.user_id);
      if (user == null) return null;
      return convertUser(user);
    },

    async updateUser(user) {
      // TODO: not only update name, make it smarter
      if (user.id == null) throw new Error("empty user id");
      const userRecord = await db.users.updateName(user.id, user.name);
      if (userRecord == null) throw new Error("user not found after update");
      return convertUser(userRecord);
    },

    async deleteUser(userId) {
      await db.sessions.deleteByUserId(userId);
      await db.accounts.deleteByUserId(userId);
      await db.users.deleteById(userId);
    },

    async linkAccount(account) {
      await db.accounts.create({
        user_id: account.userId,
        type: account.type,
        provider: account.provider,
        provider_account_id: account.providerAccountId,
        access_token: account.access_token,
        refresh_token: account.refresh_token,
        expires_at: account.expires_at,
        token_type: account.token_type,
        scope: account.scope,
        id_token: account.id_token,
        session_state: account.session_state,
      });
    },

    async unlinkAccount({ provider, providerAccountId }) {
      await db.accounts.deleteByProvider(provider, providerAccountId);
    },

    async createSession(session) {
      const sessionRecord = await db.sessions.create(session.userId, session.sessionToken, session.expires);
      if (sessionRecord == null) return null;
      return convertSession(sessionRecord);
    },

    async getSessionAndUser(sessionToken) {
      const sessionRecord = await db.sessions.getByToken(sessionToken);
      if (sessionRecord == null) return null;
      const userRecord = await db.users.getById(sessionRecord.user_id);
      if (userRecord == null) return null;
      return {
        session: convertSession(sessionRecord),
        user: convertUser(userRecord),
      };
    },

    async updateSession({ sessionToken, expires }) {
      const sessionRecord = await db.sessions.updateExpires(sessionToken, expires);
      if (sessionRecord == null) return null;
      return convertSession(sessionRecord);
    },

    async deleteSession(sessionToken) {
      await db.sessions.deleteByToken(sessionToken);
    },

    async createVerificationToken(token) {
      return await db.verificationTokens.create(token.identifier, token.token, token.expires);
    },

    async useVerificationToken({ identifier, token }) {
      const tokenRecord = await db.verificationTokens.getByToken(identifier, token);
      if (tokenRecord == null) return null;
      await db.verificationTokens.deleteByToken(identifier, token);
      return convertVerificationToken(tokenRecord);
    },
  };
}
