// This file is created by egg-ts-helper@1.29.1
// Do not modify this file!!!!!!!!!

import 'egg';
import { TreeRepository, Repository } from 'typeorm'
import MysqlSysUser from '../app/entities/mysql/sys/User'
import MongodbTestStatistics from '../app/entities/mongodb/test/Statistics'

declare module 'egg' {
  interface Context {
    entity: {
      sys: { User: typeof MysqlSysUser }
      mongodb: { test: { Statistics: typeof MongodbTestStatistics } }
    }
    repo: {
      sys: { User: Repository<MysqlSysUser> }
      mongodb: { test: { Statistics: Repository<MongodbTestStatistics> } }
    }
  }
}
