import { Service } from 'egg';
import { getConnection } from 'typeorm';

export default abstract class BaseService extends Service {
  protected getRepo () {
    return this.ctx.repo;
  }

  protected getEntity () {
    return this.ctx.entity;
  }

  protected getHelper () {
    return this.ctx.helper;
  }

  protected getRedis () {
    return this.app.redis;
  }

  protected getMongoDBManger () {
    return getConnection('mongodb').manager;
  }
}
