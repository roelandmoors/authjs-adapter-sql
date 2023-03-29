
import * as mysql from 'mysql2/promise';

import { runBasicTests } from "@next-auth/adapter-test";
import Mysql2Adapter from "../src";

async function getConnection() : Promise<mysql.Connection> {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'authjs_test'
  });
  return connection;
}



runBasicTests({
  adapter: Mysql2Adapter(getConnection),
  db: {
    connect: async () => {
      return null; //await sequelize.sync({ force: true })
    },
    verificationToken: async (where) => {
      // const verificationToken =
      //   await sequelize.models.verificationToken.findOne({ where })

      // return verificationToken?.get({ plain: true }) || null
      return null;
    },
    user: async (id) => {
      return null;
      // const user = await sequelize.models.user.findByPk(id)

      // return user?.get({ plain: true }) || null
    },
    account: async (where) => {
      return null;
      // const account = await sequelize.models.account.findOne({ where })

      // return account?.get({ plain: true }) || null
    },
    session: async (sessionToken) => {
      return null;
      // const session = await sequelize.models.session.findOne({
      //   where: { sessionToken },
      // })

      // return session?.get({ plain: true }) || null
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
