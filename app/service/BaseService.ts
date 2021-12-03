import { Service } from 'egg';
import { FindConditions, getConnection, ObjectLiteral } from 'typeorm';

export type IWhereCondition<T> = string | ObjectLiteral | FindConditions<T> | FindConditions<T>[] | undefined;
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
