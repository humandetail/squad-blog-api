// This file is created by egg-ts-helper@1.29.1
// Do not modify this file!!!!!!!!!

import 'egg';
import { TreeRepository, Repository } from 'typeorm'
import MysqlArticleCategory from '../app/entities/mysql/article/Category'
import MysqlArticlePost from '../app/entities/mysql/article/Post'
import MysqlArticleTag from '../app/entities/mysql/article/Tag'
import MysqlPersonalPersonalBase from '../app/entities/mysql/personal/PersonalBase'
import MysqlPersonalPersonalSkill from '../app/entities/mysql/personal/PersonalSkill'
import MysqlPersonalPersonalWork from '../app/entities/mysql/personal/PersonalWork'
import MysqlResourceBlogroll from '../app/entities/mysql/resource/Blogroll'
import MysqlResourcePicture from '../app/entities/mysql/resource/Picture'
import MysqlResourcePictureCategory from '../app/entities/mysql/resource/PictureCategory'
import MysqlResourcePostTemplate from '../app/entities/mysql/resource/PostTemplate'
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
      article: {
        Category: typeof MysqlArticleCategory
        Post: typeof MysqlArticlePost
        Tag: typeof MysqlArticleTag
      }
      personal: {
        PersonalBase: typeof MysqlPersonalPersonalBase
        PersonalSkill: typeof MysqlPersonalPersonalSkill
        PersonalWork: typeof MysqlPersonalPersonalWork
      }
      resource: {
        Blogroll: typeof MysqlResourceBlogroll
        Picture: typeof MysqlResourcePicture
        PictureCategory: typeof MysqlResourcePictureCategory
        PostTemplate: typeof MysqlResourcePostTemplate
      }
      sys: { Setting: typeof MysqlSysSetting; User: typeof MysqlSysUser }
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
      article: {
        Category: Repository<MysqlArticleCategory>
        Post: Repository<MysqlArticlePost>
        Tag: Repository<MysqlArticleTag>
      }
      personal: {
        PersonalBase: Repository<MysqlPersonalPersonalBase>
        PersonalSkill: Repository<MysqlPersonalPersonalSkill>
        PersonalWork: Repository<MysqlPersonalPersonalWork>
      }
      resource: {
        Blogroll: Repository<MysqlResourceBlogroll>
        Picture: Repository<MysqlResourcePicture>
        PictureCategory: Repository<MysqlResourcePictureCategory>
        PostTemplate: Repository<MysqlResourcePostTemplate>
      }
      sys: {
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
