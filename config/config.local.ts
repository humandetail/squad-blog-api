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

  config.jwt = {
    secret: 'H5IOzF0AbaUhYosuT6rKeBqwRdDPiELQ'
  };

  return config;
};
