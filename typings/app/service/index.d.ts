// This file is created by egg-ts-helper@1.29.1
// Do not modify this file!!!!!!!!!

import 'egg';
type AnyClass = new (...args: any[]) => any;
type AnyFunc<T = any> = (...args: any[]) => T;
type CanExportFunc = AnyFunc<Promise<any>> | AnyFunc<IterableIterator<any>>;
type AutoInstanceType<T, U = T extends CanExportFunc ? T : T extends AnyFunc ? ReturnType<T> : T> = U extends AnyClass ? InstanceType<U> : U;
import ExportBaseService from '../../../app/service/BaseService';
import ExportCommonAuth from '../../../app/service/common/auth';
import ExportCommonQiniu from '../../../app/service/common/qiniu';
import ExportPersonalBase from '../../../app/service/personal/Base';
import ExportPersonalSkill from '../../../app/service/personal/Skill';
import ExportPersonalWork from '../../../app/service/personal/Work';
import ExportPostCategory from '../../../app/service/post/Category';
import ExportPostTag from '../../../app/service/post/Tag';
import ExportResourceBlogroll from '../../../app/service/resource/Blogroll';
import ExportResourcePicture from '../../../app/service/resource/Picture';
import ExportResourcePictureCategory from '../../../app/service/resource/PictureCategory';
import ExportSysLog from '../../../app/service/sys/Log';
import ExportSysSetting from '../../../app/service/sys/Setting';
import ExportSysUser from '../../../app/service/sys/User';

declare module 'egg' {
  interface IService {
    baseService: AutoInstanceType<typeof ExportBaseService>;
    common: {
      auth: AutoInstanceType<typeof ExportCommonAuth>;
      qiniu: AutoInstanceType<typeof ExportCommonQiniu>;
    }
    personal: {
      base: AutoInstanceType<typeof ExportPersonalBase>;
      skill: AutoInstanceType<typeof ExportPersonalSkill>;
      work: AutoInstanceType<typeof ExportPersonalWork>;
    }
    post: {
      category: AutoInstanceType<typeof ExportPostCategory>;
      tag: AutoInstanceType<typeof ExportPostTag>;
    }
    resource: {
      blogroll: AutoInstanceType<typeof ExportResourceBlogroll>;
      picture: AutoInstanceType<typeof ExportResourcePicture>;
      pictureCategory: AutoInstanceType<typeof ExportResourcePictureCategory>;
    }
    sys: {
      log: AutoInstanceType<typeof ExportSysLog>;
      setting: AutoInstanceType<typeof ExportSysSetting>;
      user: AutoInstanceType<typeof ExportSysUser>;
    }
  }
}
