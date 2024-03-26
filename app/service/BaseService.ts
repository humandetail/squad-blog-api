import { Service } from 'egg';
import { ObjectLiteral } from 'typeorm';

export type IWhereCondition = string | ObjectLiteral | undefined;
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
    return this.ctx.getOrmManager('mongodb');
    // return getConnection('mongodb').manager;
  }
}
