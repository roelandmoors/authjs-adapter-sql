<p align="center">
  <br/>
  <a href="https://authjs.dev" target="_blank">
    <img height="64px" src="https://authjs.dev/img/logo/logo-sm.png" />
  </a>
  <a href="https://github.com/sidorares/node-mysql2#readme" target="_blank">
    <img height="64px" src="https://www.mysql.com/common/logos/logo-mysql-170x115.png"/>
  </a>
  <h3 align="center"><b>Mysql2 Adapter</b> - NextAuth.js / Auth.js</a></h3>
</p>

[![CI](https://github.com/roelandmoors/authjs-adapter-mysql2/actions/workflows/test.yml/badge.svg)](https://github.com/roelandmoors/authjs-adapter-mysql2/actions/workflows/test.yml)

---

## How to use

Install:
```
npm i authjs-adapter-mysql2
```

use [schema.sql](schema.sql) to create the tables.


```ts
import Mysql2Adapter from "authjs-adapter-mysql2";
import * as mysql from 'mysql2/promise';``

function getConnection() {
  return mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    database: 'fancydb'
  });
}
export default NextAuth({
    adapter: Mysql2Adapter(getConnection),
    providers: []
});
```



## PlanetScale

- https://planetscale.com/docs/learn/operating-without-foreign-key-constraints
- https://planetscale.com/blog/why-we-chose-nanoids-for-planetscales-api
