/**
 * <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", padding: 16}}>
 *  <p style={{fontWeight: "normal"}}>Official <a href="https://sequelize.org/docs/v6/getting-started/">Sequilize</a> adapter for Auth.js / NextAuth.js.</p>
 *  <a href="https://sequelize.org/">
 *   <img style={{display: "block"}} src="https://authjs.dev/img/adapters/sequelize.svg" height="30"/>
 *  </a>
 * </div>
 *
 * ## Installation
 *
 * ```bash npm2yarn2pnpm
 * npm install next-auth @next-auth/sequelize-adapter sequelize
 * ```
 *
 * @module @next-auth/mysql2-adapter
 */
import type {
  Adapter,
  AdapterUser,
  AdapterAccount,
  AdapterSession,
  VerificationToken,
} from "next-auth/adapters";

import { Connection } from 'mysql2/promise';
import { buildUnitOfWork } from "./db";
import { convertUser, UserRepo } from "./repo/user";
import { convertVerificationToken } from "./repo/verification";
import { convertSession } from "./repo/session";

// import * as defaultModels from "./models"

// export { defaultModels as models }


// @see https://sequelize.org/master/manual/typescript.html
// interface AccountInstance
//   extends Model<AdapterAccount, Partial<AdapterAccount>>,
//     AdapterAccount {}
// interface UserInstance
//   extends Model<AdapterUser, Partial<AdapterUser>>,
//     AdapterUser {}
// interface SessionInstance
//   extends Model<AdapterSession, Partial<AdapterSession>>,
//     AdapterSession {}
// interface VerificationTokenInstance
//   extends Model<VerificationToken, Partial<VerificationToken>>,
//     VerificationToken {}

/** This is the interface of the Sequelize adapter options. */
// export interface SequelizeAdapterOptions {
//   /**
//    * Whether to {@link https://sequelize.org/docs/v6/core-concepts/model-basics/#model-synchronization synchronize} the models or not.
//    */
//   synchronize?: boolean
//   /**
//    * The {@link https://sequelize.org/docs/v6/core-concepts/model-basics/ Sequelize Models} related to Auth.js that will be created in your database.
//    */
//   models?: Partial<{
//     User: ModelCtor<UserInstance>
//     Account: ModelCtor<AccountInstance>
//     Session: ModelCtor<SessionInstance>
//     VerificationToken: ModelCtor<VerificationTokenInstance>
//   }>
// }

/**
 * :::warning
 * You'll also have to manually install [the driver for your database](https://sequelize.org/master/manual/getting-started.html) of choice.
 * :::
 *
 * ## Setup
 *
 * ### Configuring Auth.js
 *
 *  Add this adapter to your `pages/api/[...nextauth].js` next-auth configuration object.
 *
 * ```javascript title="pages/api/auth/[...nextauth].js"
 * import NextAuth from "next-auth"
 * import SequelizeAdapter from "@next-auth/sequelize-adapter"
 * import { Sequelize } from "sequelize"
 *
 * // https://sequelize.org/master/manual/getting-started.html#connecting-to-a-database
 * const sequelize = new Sequelize("yourconnectionstring")
 *
 * // For more information on each option (and a full list of options) go to
 * // https://authjs.dev/reference/configuration/auth-config
 * export default NextAuth({
 *   // https://authjs.dev/reference/providers/
 *   providers: [],
 *   adapter: SequelizeAdapter(sequelize),
 * })
 * ```
 *
 * ### Updating the database schema
 *
 * By default, the sequelize adapter will not create tables in your database. In production, best practice is to create the [required tables](https://authjs.dev/reference/adapters/models) in your database via [migrations](https://sequelize.org/master/manual/migrations.html). In development, you are able to call [`sequelize.sync()`](https://sequelize.org/master/manual/model-basics.html#model-synchronization) to have sequelize create the necessary tables, foreign keys and indexes:
 *
 * > This schema is adapted for use in Sequelize and based upon our main [schema](https://authjs.dev/reference/adapters#models)
 *
 * ```js
 * import NextAuth from "next-auth"
 * import SequelizeAdapter from "@next-auth/sequelize-adapter"
 * import Sequelize from 'sequelize'
 *
 * const sequelize = new Sequelize("sqlite::memory:")
 * const adapter = SequelizeAdapter(sequelize)
 *
 * // Calling sync() is not recommended in production
 * sequelize.sync()
 *
 * export default NextAuth({
 *   ...
 *   adapter
 *   ...
 * })
 * ```
 *
 * ## Advanced usage
 *
 * ### Using custom models
 *
 * Sequelize models are option to customization like so:
 *
 * ```js
 * import NextAuth from "next-auth"
 * import SequelizeAdapter, { models } from "@next-auth/sequelize-adapter"
 * import Sequelize, { DataTypes } from "sequelize"
 *
 * const sequelize = new Sequelize("sqlite::memory:")
 *
 * export default NextAuth({
 *   // https://authjs.dev/reference/providers/
 *   providers: [],
 *   adapter: SequelizeAdapter(sequelize, {
 *     models: {
 *       User: sequelize.define("user", {
 *         ...models.User,
 *         phoneNumber: DataTypes.STRING,
 *       }),
 *     },
 *   }),
 * })
 * ```
 */




export default function Mysql2Adapter(
  getConnection: () => Promise<Connection>
): Adapter {

  const db = buildUnitOfWork(getConnection);

  return {
    async createUser(user) {
      const userRecord = await db.users.create(user.name, user.image, user.email, user.emailVerified)
      if (userRecord == null) 
        throw new Error("creaing user failed!");
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
      if (user.id == null) return null;
      const userRecord = await db.users.updateName(user.id, user.name)
      if (userRecord == null) return null;
      return convertUser(userRecord);
    },

    async deleteUser(userId) {
      await db.sessions.deleteByUserId(userId)
      await db.accounts.deleteByUserId(userId);
      await db.users.deleteById(userId)
    },

    async linkAccount(account) {

      await db.accounts.create({
        user_id : account.userId,
        type : account.type,
        provider : account.provider,
        provider_account_id : account.providerAccountId,
        refresh_token : account.refresh_token,
        expires_at : account.expires_at,
        token_type : account.token_type,
        scope : account.scope,
        id_token : account.id_token,
        session_state : account.session_state,
      })
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
      }      
    },

    async updateSession({ sessionToken, expires }) {
      const sessionRecord = await db.sessions.updateExpires(sessionToken, expires);
      if (sessionRecord == null) return null;
      return convertSession(sessionRecord);
    },

    async deleteSession(sessionToken) {
      await db.sessions.deleteByToken(sessionToken)
    },

    async createVerificationToken(token) {
      return await db.verificationTokens.create(token.identifier, token.token, token.expires)
    },

    async useVerificationToken({ identifier, token }) {
      const tokenRecord = await db.verificationTokens.getByToken(identifier, token);
      if (tokenRecord == null) return null;
      await db.verificationTokens.deleteByToken(identifier, token);
      return convertVerificationToken(tokenRecord);
    },
  }
}
