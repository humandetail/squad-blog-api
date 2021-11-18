// This file is created by egg-ts-helper@1.29.1
// Do not modify this file!!!!!!!!!

import 'egg';
import { TreeRepository, Repository } from 'typeorm'
import EntitiesSysUser from '../app/entities/sys/User'

declare module 'egg' {
  interface Context {
    entity: {
      sys: { User: typeof EntitiesSysUser }
    }
    repo: {
      sys: { User: Repository<EntitiesSysUser> }
    }
  }
}
