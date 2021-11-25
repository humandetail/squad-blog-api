import { Service } from 'egg';
import { getConnection } from 'typeorm';

interface DateFileds {
  createdTime: Date;
  updatedTime: Date;
}
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

  protected formateDateField<T extends DateFileds> (input: T): Omit<T, 'createdTime' | 'updatedTime'> {
    const { createdTime, updatedTime, ...otherProps } = input;
    const { formatDate } = this.getHelper();
    return {
      ...otherProps,
      createdTime: formatDate(createdTime),
      updatedTime: formatDate(updatedTime)
    };
  }
}
