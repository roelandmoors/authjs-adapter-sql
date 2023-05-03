<p align="center">
  <br/>
  <a href="https://authjs.dev" target="_blank">
    <img height="64px" src="https://authjs.dev/img/logo/logo-sm.png" />
  </a>
  <h3 align="center"><b>Sql Adapter</b> - NextAuth.js / Auth.js</a></h3>
</p>

[![mysql](https://github.com/roelandmoors/authjs-adapter-sql/actions/workflows/mysql_test.yml/badge.svg)](https://github.com/roelandmoors/authjs-adapter-sql/actions/workflows/mysql_test.yml)
[![postgres](https://github.com/roelandmoors/authjs-adapter-sql/actions/workflows/postgres_test.yml/badge.svg)](https://github.com/roelandmoors/authjs-adapter-sql/actions/workflows/postgres_test.yml)

---

This adapter uses plain sql statements to integrate with [Authjs](https://authjs.dev/).

Support for Mysql and Postgres. Also works on [PlanetScale](https://planetscale.com/).

## How to use with Mysql2

Install:

```
npm i authjs-adapter-sql mysql2
```

use [mysql.sql](mysql.sql) to create the tables.
(you can add foreign keys if needed)

```ts
import SqlAdapter from "authjs-adapter-sql";
import * as mysql from "mysql2/promise";
import buildMysql2Helpers from "authjs-adapter-sql/mysql2";

function getConnection() {
  return mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    database: "fancydb",
  });
}

// you can create your own helpers for custom logic
const mysql2Helpers = buildMysql2Helpers(getConnection);

export default NextAuth({
  adapter: SqlAdapter(mysql2Helpers),
  providers: [],
});
```

When using the new app dir in NextJs you may need this:

```ts
const nextConfig = {
  experimental: {
    appDir: true,
    serverComponentsExternalPackages: ["mysql2"],
  },
};
```

## How to use with PlanetScale serverless driver

Install:

```
npm i authjs-adapter-sql @planetscale/database
```

use [mysql.sql](mysql.sql) to create the tables.

```ts
import SqlAdapter from "authjs-adapter-sql";
import buildPlanetScaleHelpers from "authjs-adapter-sql/planetscale";

const client = new Client(config);

// you can create your own helpers for custom logic
const psHelpers = buildPlanetScaleHelpers(client);

export default NextAuth({
  adapter: SqlAdapter(psHelpers),
  providers: [],
});
```

- https://planetscale.com/docs/learn/operating-without-foreign-key-constraints
- https://planetscale.com/docs/tutorials/planetscale-serverless-driver

## How to use with pg-promise

Install:

```
npm i authjs-adapter-sql pg-promise
```

use [postgres.sql](postgres.sql) to create the tables.
(you can add foreign keys if needed)

```ts
import SqlAdapter from "authjs-adapter-sql";
import pgPromise from "pg-promise";
import buildPgPromiseHelpers from "../src/pg-promise";

const pgp = pgPromise();
const db = pgp("postgres://postgres:postgres@localhost:5432/postgres");

function getConnection() {
  return db;
}

// you can create your own helpers for custom logic
const pgHelpers = buildPgPromiseHelpers(getConnection);

export default NextAuth({
  adapter: SqlAdapter(pgHelpers),
  providers: [],
});
```
