import { EggAppConfig, PowerPartial } from 'egg';

export default () => {
  const config: PowerPartial<EggAppConfig> = {};

  // typeorm 配置
  config.typeorm = {
    client: {
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'squad-blog',
      synchronize: true,
    },
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

  // swagger 配置
  config.swaggerdoc = {
    dirScanner: './app/controller',
    apiInfo: {
      title: '接口文档',
      description: 'squad-blog 接口文档',
      version: '1.0.0',
    },
    schemes: [ 'http', 'https' ],
    consumes: [ 'application/json' ],
    produces: [ 'application/json' ],
    securityDefinitions: {
      // apikey: {
      //   type: 'apiKey',
      //   name: 'clientkey',
      //   in: 'header',
      // },
      // oauth2: {
      //   type: 'oauth2',
      //   tokenUrl: 'http://petstore.swagger.io/oauth/dialog',
      //   flow: 'password',
      //   scopes: {
      //     'write:access_token': 'write access_token',
      //     'read:access_token': 'read access_token',
      //   },
      // },
    },
    enableSecurity: false,
    // enableValidate: true,
    routerMap: false,
    enable: true,
  };

  return config;
};
