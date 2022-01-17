import { EggAppConfig, EggAppInfo, PowerPartial } from 'egg';

export default (appInfo: EggAppInfo) => {
  const config = {} as PowerPartial<EggAppConfig>;

  // override config from framework / plugin
  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1637130714390_9451';

  /**
   * 框架内置了国际化（I18n）支持，由 egg-i18n 插件提供。
   * @see https://github.com/eggjs/egg-i18n
   */
  config.i18n = {
    defaultLocale: 'zh-CN'
  };

  /**
   * @see https://eggjs.org/zh-cn/core/security.html
   */
  config.security = {
    csrf: {
      // 默认为 false，当设置为 true 时，将会放过所有 content-type 为 `application/json` 的请求
      enable: false,
      ignoreJSON: true,
    },
  };
  /**
   * CORS
   * @see https://github.com/eggjs/egg-cors
   */
  config.cors = {
    // origin: '*',
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH',
  };

  /**
   * @see https://eggjs.org/zh-cn/basics/controller.html#获取上传的文件
   */
  config.multipart = {
    mode: 'file',
    fields: 100 // Reach fields limit
  };

  /**
   * @see https://github.com/eggjs/egg-global-header
   */
  config.globalHeader = {
    'Powered-by': 'squad-blog',
  };

  // add your egg config in here
  config.middleware = [
    // 加载错误处理中间件
    'errorHandler',
    // 加载鉴权中间件
    'adminAuthority',
    // 加载日志记录中间件
    'adminLog'
  ];

  config.errorHandler = {
    match: '/api'
  };

  config.adminAuthority = {
    match: '/api'
  };

  config.adminLog = {
    match: '/api'
  };

  // typeorm 配置
  config.typeorm = {
    clients: [
      {
        name: 'default',
        type: 'mysql',
        host: 'localhost',
        port: 3306,
        // username: 'root',
        // password: 'root',
        // database: 'squad-blog',
        synchronize: true,
        logger: 'file',
        logging: true
      },
      {
        name: 'mongodb',
        type: 'mongodb',
        host: 'localhost',
        port: 27017,
        // database: 'squad-blog'
      }
    ],
  };

  // redis 配置
  config.redis = {
    client: {
      port: 6379,
      host: 'localhost',
      // password: '',
      // db: 0,
    },
  };

  // 七牛配置
  // @see https://developer.qiniu.com/kodo/sdk/nodejs
  config.qiniu = {
    // accessKey: '',
    // secretKey: '',

    // // 机房	Zone对象
    // // 华东	qiniu.zone.Zone_z0
    // // 华北	qiniu.zone.Zone_z1
    // // 华南	qiniu.zone.Zone_z2
    // // 北美	qiniu.zone.Zone_na0
    // zone: 'Zone_z2',
    // bucket: 'squad-dev',
    // ossDomain: 'http://r3eyoxri0.hn-bkt.clouddn.com/'
  };

  // add your special config in here
  const bizConfig = {
    sourceUrl: `https://github.com/eggjs/examples/tree/master/${appInfo.name}`,
  };

  // the return config will combines to EggAppConfig
  return {
    ...config,
    ...bizConfig,
  };
};
