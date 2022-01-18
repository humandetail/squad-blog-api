import { Application } from 'egg';

export const initRunParams = (app: Application) => {
  const npmConfigArgv = JSON.parse(process.argv[2] || '{}');
  console.log(npmConfigArgv);
  const [accessKey, secretKey, zone, bucket, ossDomain] = (npmConfigArgv?.qiniu || '').split('}}');
  const [mysqlUsername, mysqlPassword, mysqlDatabase] = (npmConfigArgv?.mysql || '').split('}}');
  const [mongodbUsername, mongodbPassword, mongodbDatabase] = (npmConfigArgv?.mongodb || '').spit('}}');
  const [redisPassword, redisDb] = (npmConfigArgv?.redis || '').split('}}');

  app.config.qiniu = {
    accessKey,
    secretKey,

    // 机房	Zone对象
    // 华东	qiniu.zone.Zone_z0
    // 华北	qiniu.zone.Zone_z1
    // 华南	qiniu.zone.Zone_z2
    // 北美	qiniu.zone.Zone_na0
    zone,
    bucket,
    ossDomain
  };

  app.config.typeorm = {
    clients: [
      {
        name: 'default',
        type: 'mysql',
        host: 'localhost',
        port: 3306,
        username: mysqlUsername,
        password: mysqlPassword,
        database: mysqlDatabase,
        synchronize: true
      },
      {
        name: 'mongodb',
        type: 'mongodb',
        host: 'localhost',
        port: 27017,
        username: mongodbUsername,
        password: mongodbPassword,
        database: mongodbDatabase,
        synchronize: true,
      }
    ]
  };

  app.config.redis = {
    client: {
      port: 6379,
      host: 'localhost',
      password: redisPassword ?? '',
      db: redisDb,
    },
  };
};
