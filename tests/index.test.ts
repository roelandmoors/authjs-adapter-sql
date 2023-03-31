
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

// describe("Additional Sequelize tests", () => {
//   describe("synchronize option", () => {
//     const lowercase = (strs: string[]) =>
//       strs.map((s) => s.replace(/[^a-z]/gi, "").toLowerCase())

//     beforeEach(async () => {
//       await sequelize.getQueryInterface().dropAllTables()

//       const { getUser } = SequelizeAdapter(sequelize)

//       await getUser("1")
//     })

//     test("Creates DB tables", async () => {
//       const tables = await sequelize.getQueryInterface().showAllSchemas()

//       expect(tables).toEqual([
//         { name: "users" },
//         { name: "accounts" },
//         { name: "sessions" },
//         { name: "verification_tokens" },
//       ])
//     })

//     test("Correctly creates users table", async () => {
//       const table = await sequelize.getQueryInterface().describeTable("users")

//       expect(lowercase(Object.keys(table))).toEqual(
//         lowercase(Object.keys(models.User))
//       )
//     })

//     test("Correctly creates accounts table", async () => {
//       const table = await sequelize
//         .getQueryInterface()
//         .describeTable("accounts")

//       expect(lowercase(Object.keys(table))).toEqual(
//         lowercase(Object.keys(models.Account))
//       )
//     })

//     test("Correctly creates sessions table", async () => {
//       const table = await sequelize
//         .getQueryInterface()
//         .describeTable("sessions")

//       expect(lowercase(Object.keys(table))).toEqual(
//         lowercase(Object.keys(models.Session))
//       )
//     })

//     test("Correctly creates verification_tokens table", async () => {
//       const table = await sequelize
//         .getQueryInterface()
//         .describeTable("verification_tokens")

//       expect(lowercase(Object.keys(table))).toEqual(
//         lowercase(Object.keys(models.VerificationToken))
//       )
//     })
//   })

//   describe("overriding models", () => {
//     beforeEach(async () => {
//       await sequelize.getQueryInterface().dropAllTables()

//       const { getUser } = SequelizeAdapter(sequelize, {
//         synchronize: true,
//         models: {
//           User: sequelize.define("users", {
//             ...models.User,
//             someUserAttribute: { type: DataTypes.STRING },
//           }),
//           Account: sequelize.define("accounts", {
//             ...models.Account,
//             someAccountAttribute: { type: DataTypes.STRING },
//           }),
//           Session: sequelize.define("sessions", {
//             ...models.Session,
//             someSessionAttribute: { type: DataTypes.STRING },
//           }),
//           VerificationToken: sequelize.define("verification_tokens", {
//             ...models.VerificationToken,
//             someVerificationTokenAttribute: { type: DataTypes.STRING },
//           }),
//         },
//       })

//       await getUser("1")
//     })

//     test("Custom user model", async () => {
//       const table = await sequelize.getQueryInterface().describeTable("users")

//       expect(table.someUserAttribute).toBeDefined()
//     })

//     test("Custom account model", async () => {
//       const table = await sequelize
//         .getQueryInterface()
//         .describeTable("accounts")

//       expect(table.someAccountAttribute).toBeDefined()
//     })

//     test("Custom session model", async () => {
//       const table = await sequelize
//         .getQueryInterface()
//         .describeTable("sessions")

//       expect(table.someSessionAttribute).toBeDefined()
//     })

//     test("Custom verification_token model", async () => {
//       const table = await sequelize
//         .getQueryInterface()
//         .describeTable("verification_tokens")

//       expect(table.someVerificationTokenAttribute).toBeDefined()
//     })
//   })
// })
