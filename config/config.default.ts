import { EggAppConfig, EggAppInfo, PowerPartial } from 'egg';
import { readFileSync } from 'fs';
import { resolve } from 'path';

const str = JSON.parse(readFileSync(resolve(__dirname, './account.config.json'), 'utf8') || '{}');
const {
  typeorm,
  redis,
  qiniu,
  jwt
} = str;

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
  config.typeorm = typeorm;

  // redis 配置
  config.redis = redis;

  // 七牛配置
  // @see https://developer.qiniu.com/kodo/sdk/nodejs
  config.qiniu = qiniu;

  // jwt配置
  config.jwt = jwt;

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
