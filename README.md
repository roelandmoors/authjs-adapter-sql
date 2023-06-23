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

Support for Mysql ([mysql2](https://github.com/sidorares/node-mysql2)) and Postgres ([pg](https://node-postgres.com/)).  
Also works with the [PlanetScale Serverless Driver](https://github.com/planetscale/database-js), [Neon Serverless Driver](https://github.com/neondatabase/serverless), [Kysely](https://kysely-org.github.io/kysely/), [Knex](https://knexjs.org/), [Slonik](https://github.com/gajus/slonik) and [Vercel](https://github.com/vercel/storage/tree/main/packages/postgres)

You can create a custom helper function to support other drivers if needed.

## Configuration

You can set an optional table prefix/postgres **schema**.  
There is also a **verbose** option to log all actions

```ts
const config = {
  prefix: "auth_", // or for example 'auth.' for a postgres schema
  verbose: true, // optional, false by default
};

export default NextAuth({
  adapter: SqlAdapter(helpers, config),
  providers: [],
});
```

## Default vs named imports

If you have problems with default imports in modules, than you can also try named imports.

Instead of this:

```ts
import SqlAdapter from "authjs-adapter-sql";
import buildMysql2Helpers from "authjs-adapter-sql/mysql2";
```

try this:

```ts
import { SqlAdapter } from "authjs-adapter-sql";
import { buildMysql2Helpers } from "authjs-adapter-sql/mysql2";
```

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

## How to use with pg

Install:

```
npm i authjs-adapter-sql pg
```

use [postgres.sql](postgres.sql) to create the tables.
(you can add foreign keys if needed)

```ts
import SqlAdapter from "authjs-adapter-sql";
import { Pool } from "pg";
import buildPgHelpers from "../src/pg";

const pool = new Pool({
  connectionString: "postgres://postgres:postgres@localhost:5432/postgres",
});

// you can create your own helpers for custom logic
const pgHelpers = buildPgHelpers(() => pool.connect());

export default NextAuth({
  adapter: SqlAdapter(pgHelpers),
  providers: [],
});
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

## How to use with Neon Serverless Driver

Install:

```
npm i authjs-adapter-sql @neondatabase/serverless
```

use [postgres.sql](postgres.sql) to create the tables.
(you can add foreign keys if needed)

```ts
import SqlAdapter from "authjs-adapter-sql";
import buildNeonHelpers from "authjs-adapter-sql/neon";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// you can create your own helpers for custom logic
const helpers = buildNeonHelpers(pool);

export default NextAuth({
  adapter: SqlAdapter(helpers),
  providers: [],
});
```

## How to use with Kysely

Install:

```
npm i kysely mysql2 (or pg)
```

use [mysql.sql](mysql.sql) or [postgres.sql](postgres.sql) to create the tables.
(you can add foreign keys if needed)

```ts
import SqlAdapter from "authjs-adapter-sql";
import { Kysely, MysqlDialect } from "kysely";
import buildKyselyHelpers from "authjs-adapter-sql/kysely";

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

const db = new Kysely({
  dialect: new MysqlDialect({
    pool,
  }),
});

// you can create your own helpers for custom logic
const helpers = buildKyselyHelpers(db, "mysql"); //or postgres

export default NextAuth({
  adapter: SqlAdapter(helpers),
  providers: [],
});
```

## How to use with Knex

Install:

```
npm i knex mysql2 (or pg)
```

use [mysql.sql](mysql.sql) or [postgres.sql](postgres.sql) to create the tables.
(you can add foreign keys if needed)

```ts
import SqlAdapter from "authjs-adapter-sql";
import { Knex, knex } from "knex";
import buildKnexHelpers from "authjs-adapter-sql/knex";

const config: Knex.Config = {
  client: "mysql2",
  connection: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  },
};

const knexInstance = knex(config);

// you can create your own helpers for custom logic
const helpers = buildKnexHelpers(knexInstance, "mysql"); //or postgres

export default NextAuth({
  adapter: SqlAdapter(helpers),
  providers: [],
});
```

## How to use with Slonik

Install:

```
npm i slonik pg
```

use [postgres.sql](postgres.sql) to create the tables.
(you can add foreign keys if needed)

```ts
import SqlAdapter from "authjs-adapter-sql";
import buildSlonikHelpers from "authjs-adapter-sql/slonik";
import { createPool } from "slonik";

const poolPromise = createPool("postgres://postgres:postgres@localhost:5432/postgres");

function getConnection() {
  return poolPromise;
}

// you can create your own helpers for custom logic
const helpers = buildSlonikHelpers(getConnection);

export default NextAuth({
  adapter: SqlAdapter(helpers),
  providers: [],
});
```

## How to use with @vercel/postgres

Install:

```
npm i authjs-adapter-sql @vercel/postgres
```

use [postgres.sql](postgres.sql) to create the tables.
(you can add foreign keys if needed)

```ts
import SqlAdapter from "authjs-adapter-sql";
import buildVercelHelpers from "authjs-adapter-sql/vercel";
import { createPool } from "@vercel/postgres";

const pool = createPool();

// you can create your own helpers for custom logic
const helpers = buildVercelHelpers(pool);

export default NextAuth({
  adapter: SqlAdapter(helpers),
  providers: [],
});
```
