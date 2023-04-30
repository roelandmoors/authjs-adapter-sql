<p align="center">
  <br/>
  <a href="https://authjs.dev" target="_blank">
    <img height="64px" src="https://authjs.dev/img/logo/logo-sm.png" />
  </a>
  <a href="https://github.com/sidorares/node-mysql2#readme" target="_blank">
    <img height="64px" src="https://www.mysql.com/common/logos/logo-mysql-170x115.png"/>
  </a>
  <h3 align="center"><b>Mysql/PlanetScale Adapter</b> - NextAuth.js / Auth.js</a></h3>
</p>

[![CI](https://github.com/roelandmoors/authjs-adapter-mysql/actions/workflows/test.yml/badge.svg)](https://github.com/roelandmoors/authjs-adapter-mysql/actions/workflows/test.yml)

---

This adapter uses mysql statements to integrate with [Authjs](https://authjs.dev/).

[PlanetScale](https://planetscale.com/) is supported with Mysql2 or the serverless driver.

## How to use with Mysql2

Install:

```
npm i authjs-adapter-mysql mysql2
```

use [schema.sql](schema.sql) to create the tables.

```ts
import MysqlAdapter from "authjs-adapter-mysql";
import * as mysql from "mysql2/promise";
import buildMysqlHelpers from "authjs-adapter-mysql/dist/mysql";

function getConnection() {
  return mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    database: "fancydb",
  });
}

// or create your own to replace mysql2
const mysqlHelpers = buildMysqlHelpers(getConnection);

export default NextAuth({
  adapter: MysqlAdapter(mysqlHelpers),
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
npm i authjs-adapter-mysql @planetscale/database
```

use [schema.sql](schema.sql) to create the tables.

```ts
import MysqlAdapter from "authjs-adapter-mysql";
import buildPlanetScaleHelpers from "authjs-adapter-mysql/dist/planetscale";

const client = new Client(config);
const psHelpers = buildPlanetScaleHelpers(client);

export default NextAuth({
  adapter: MysqlAdapter(psHelpers),
  providers: [],
});
```

- https://planetscale.com/docs/learn/operating-without-foreign-key-constraints
- https://planetscale.com/docs/tutorials/planetscale-serverless-driver
