import { Application } from 'egg';
import { IBoot } from 'egg';
import { initSetting, initUser, initRole } from './app/libs/init';

class AppBootHook implements IBoot {
  private readonly app: Application;

  constructor(app: Application) {
    this.app = app;
  }

  configWillLoad() {
    // 此时 config 文件已经被读取并合并，但是还并未生效
    // 这是应用层修改配置的最后时机
    // 注意：此函数只支持同步调用
    // const npmConfigArgv = JSON.parse(process.env.npm_config_argv || '{}');
    const npmConfigArgv = JSON.parse(process.argv[2] || '{}');
    // const remain = (npmConfigArgv?.remain || []).reduce((prev, item) => {
    //   const [key, value] = item.split('=');
    //   prev[key] = value;

    //   return prev;
    // }, {});
    console.log(npmConfigArgv);
    const [accessKey, secretKey, zone, bucket, ossDomain] = (npmConfigArgv?.qiniu || '').split('}}');
    const [mysqlUsername, mysqlPassword, mysqlDatabase] = (npmConfigArgv?.mysql || '').split('}}');
    const [mongodbUsername, mongodbPassword, mongodbDatabase] = (npmConfigArgv?.mongodb || '').spit('}}');
    const [redisPassword, redisDb] = (npmConfigArgv?.redis || '').split('}}');

    this.app.config.qiniu = {
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

    this.app.config.typeorm = {
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

    this.app.config.redis = {
      client: {
        port: 6379,
        host: 'localhost',
        password: redisPassword ?? '',
        db: redisDb,
      },
    };
  }

  async didLoad() {
    // 所有的配置已经加载完毕
    // 可以用来加载应用自定义的文件，启动自定义的服务
  }

  async willReady() {
    // 所有的插件都已启动完毕，但是应用整体还未 ready
    // 可以做一些数据初始化等操作，这些操作成功才会启动应用
  }

  async didReady() {
    // 应用已经启动完毕
    await initRole(this.app);
    await initUser(this.app);
    await initSetting(this.app);
  }

  async serverDidReady() {
    // http / https server 已启动，开始接受外部请求
    // 此时可以从 app.server 拿到 server 的实例
  }
}

module.exports = AppBootHook;
