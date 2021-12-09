// This file is created by egg-ts-helper@1.29.1
// Do not modify this file!!!!!!!!!

import 'egg';
import { TreeRepository, Repository } from 'typeorm'
import MysqlPersonalPersonalBase from '../app/entities/mysql/personal/PersonalBase'
import MysqlPersonalPersonalSkill from '../app/entities/mysql/personal/PersonalSkill'
import MysqlPersonalPersonalWork from '../app/entities/mysql/personal/PersonalWork'
import MysqlPostCategory from '../app/entities/mysql/post/Category'
import MysqlPostPost from '../app/entities/mysql/post/Post'
import MysqlPostTag from '../app/entities/mysql/post/Tag'
import MysqlResourceBlogroll from '../app/entities/mysql/resource/Blogroll'
import MysqlResourcePicture from '../app/entities/mysql/resource/Picture'
import MysqlResourcePictureCategory from '../app/entities/mysql/resource/PictureCategory'
import MysqlResourcePostTemplate from '../app/entities/mysql/resource/PostTemplate'
import MysqlSysMenu from '../app/entities/mysql/sys/Menu'
import MysqlSysRole from '../app/entities/mysql/sys/Role'
import MysqlSysSetting from '../app/entities/mysql/sys/Setting'
import MysqlSysUser from '../app/entities/mysql/sys/User'
import MongodbBaseEntity from '../app/entities/mongodb/BaseEntity'
import MongodbArticleKeywords from '../app/entities/mongodb/article/Keywords'
import MongodbArticlePostView from '../app/entities/mongodb/article/PostView'
import MongodbSysLog from '../app/entities/mongodb/sys/Log'
import MongodbSysStatistic from '../app/entities/mongodb/sys/Statistic'

declare module 'egg' {
  interface Context {
    entity: {
      personal: {
        PersonalBase: typeof MysqlPersonalPersonalBase
        PersonalSkill: typeof MysqlPersonalPersonalSkill
        PersonalWork: typeof MysqlPersonalPersonalWork
      }
      post: {
        Category: typeof MysqlPostCategory
        Post: typeof MysqlPostPost
        Tag: typeof MysqlPostTag
      }
      resource: {
        Blogroll: typeof MysqlResourceBlogroll
        Picture: typeof MysqlResourcePicture
        PictureCategory: typeof MysqlResourcePictureCategory
        PostTemplate: typeof MysqlResourcePostTemplate
      }
      sys: {
        Menu: typeof MysqlSysMenu
        Role: typeof MysqlSysRole
        Setting: typeof MysqlSysSetting
        User: typeof MysqlSysUser
      }
      mongodb: {
        BaseEntity: typeof MongodbBaseEntity
        article: {
          Keywords: typeof MongodbArticleKeywords
          PostView: typeof MongodbArticlePostView
        }
        sys: {
          Log: typeof MongodbSysLog
          Statistic: typeof MongodbSysStatistic
        }
      }
    }
    repo: {
      personal: {
        PersonalBase: Repository<MysqlPersonalPersonalBase>
        PersonalSkill: Repository<MysqlPersonalPersonalSkill>
        PersonalWork: Repository<MysqlPersonalPersonalWork>
      }
      post: {
        Category: Repository<MysqlPostCategory>
        Post: Repository<MysqlPostPost>
        Tag: Repository<MysqlPostTag>
      }
      resource: {
        Blogroll: Repository<MysqlResourceBlogroll>
        Picture: Repository<MysqlResourcePicture>
        PictureCategory: Repository<MysqlResourcePictureCategory>
        PostTemplate: Repository<MysqlResourcePostTemplate>
      }
      sys: {
        Menu: Repository<MysqlSysMenu>
        Role: Repository<MysqlSysRole>
        Setting: Repository<MysqlSysSetting>
        User: Repository<MysqlSysUser>
      }
      mongodb: {
        BaseEntity: Repository<MongodbBaseEntity>
        article: {
          Keywords: Repository<MongodbArticleKeywords>
          PostView: Repository<MongodbArticlePostView>
        }
        sys: {
          Log: Repository<MongodbSysLog>
          Statistic: Repository<MongodbSysStatistic>
        }
      }
    }
  }
}
