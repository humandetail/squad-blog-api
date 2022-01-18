# hackernews-async-ts

[Hacker News](https://news.ycombinator.com/) showcase using typescript && egg

## QuickStart

### Account.config.json

`config/account.config.json`

```json
{
  "typeorm": {
    "clients": [
      {
        "name": "default",
        "type": "mysql",
        "host": "localhost",
        "port": 3306,
        "username": "root",
        "password": "root",
        "database": "squad-blog",
        "synchronize": true,
        "logger": "file",
        "logging": true
      },
      {
        "name": "mongodb",
        "type": "mongodb",
        "host": "localhost",
        "port": 27017,
        "database": "squad-blog"
      }
    ]
  },
  "redis": {
    "client": {
      "port": 6379,
      "host": "localhost",
      "password": "",
      "db": 0
    }
  },
  "qiniu": {
    "accessKey": "YOUR_QINIU_ACCESS_KEY",
    "secretKey": "YOUR_QINIU_SECRET_KEY",
    "zone": "Zone_z2",
    "bucket": "squad-dev",
    "ossDomain": "http://r3eyoxri0.hn-bkt.clouddn.com/"
  }
}
```

### Development

```bash
$ npm i
$ npm run dev
```

Don't tsc compile at development mode, if you had run `tsc` then you need to `npm run clean` before `npm run dev`.

### Deploy

```bash
$ npm run tsc
$ npm start
```

### Npm Scripts

- Use `npm run lint` to check code style
- Use `npm test` to run unit test
- se `npm run clean` to clean compiled js at development mode once

### Requirement

- Node.js 8.x
- Typescript 2.8+
