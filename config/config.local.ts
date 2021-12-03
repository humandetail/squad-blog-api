import { EggAppConfig, PowerPartial } from 'egg';

export default () => {
  const config: PowerPartial<EggAppConfig> = {};

  // typeorm 配置
  config.typeorm = {
    clients: [
      {
        name: 'default',
        type: 'mysql',
        host: 'localhost',
        port: 3306,
        username: 'root',
        password: 'root',
        database: 'squad-blog',
        synchronize: true,
        logger: 'file',
        logging: true
      },
      {
        name: 'mongodb',
        type: 'mongodb',
        host: 'localhost',
        port: 27017,
        database: 'squad-blog'
      }
    ],
  };

  // redis 配置
  config.redis = {
    client: {
      port: 6379,
      host: 'localhost',
      password: '',
      db: 0,
    },
  };

  // 七牛配置
  // @see https://developer.qiniu.com/kodo/sdk/nodejs
  config.qiniu = {
    accessKey: '',
    secretKey: '',

    // 机房	Zone对象
    // 华东	qiniu.zone.Zone_z0
    // 华北	qiniu.zone.Zone_z1
    // 华南	qiniu.zone.Zone_z2
    // 北美	qiniu.zone.Zone_na0
    zone: 'Zone_z2',
    bucket: 'squad-dev',
    ossDomain: 'http://r3eyoxri0.hn-bkt.clouddn.com/'
  };

  config.jwt = {
    secret: 'H5IOzF0AbaUhYosuT6rKeBqwRdDPiELQ'
  };

  return config;
};
