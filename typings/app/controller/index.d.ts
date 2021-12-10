// This file is created by egg-ts-helper@1.29.1
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportBaseController from '../../../app/controller/BaseController';
import ExportBackendCommonAuth from '../../../app/controller/backend/common/Auth';
import ExportBackendPersonalBase from '../../../app/controller/backend/personal/Base';
import ExportBackendPersonalSKill from '../../../app/controller/backend/personal/SKill';
import ExportBackendPersonalWork from '../../../app/controller/backend/personal/Work';
import ExportBackendPostCategory from '../../../app/controller/backend/post/Category';
import ExportBackendPostPost from '../../../app/controller/backend/post/Post';
import ExportBackendPostTag from '../../../app/controller/backend/post/Tag';
import ExportBackendResourceBlogroll from '../../../app/controller/backend/resource/Blogroll';
import ExportBackendResourcePostTemplate from '../../../app/controller/backend/resource/PostTemplate';
import ExportBackendSysMenu from '../../../app/controller/backend/sys/Menu';
import ExportBackendSysRole from '../../../app/controller/backend/sys/Role';
import ExportBackendSysSetting from '../../../app/controller/backend/sys/Setting';
import ExportBackendResourcePictureCategory from '../../../app/controller/backend/resource/picture/Category';
import ExportBackendResourcePicturePicture from '../../../app/controller/backend/resource/picture/Picture';
import ExportBackendSysUserUser from '../../../app/controller/backend/sys/user/User';

declare module 'egg' {
  interface IController {
    baseController: ExportBaseController;
    backend: {
      common: {
        auth: ExportBackendCommonAuth;
      }
      personal: {
        base: ExportBackendPersonalBase;
        sKill: ExportBackendPersonalSKill;
        work: ExportBackendPersonalWork;
      }
      post: {
        category: ExportBackendPostCategory;
        post: ExportBackendPostPost;
        tag: ExportBackendPostTag;
      }
      resource: {
        blogroll: ExportBackendResourceBlogroll;
        postTemplate: ExportBackendResourcePostTemplate;
        picture: {
          category: ExportBackendResourcePictureCategory;
          picture: ExportBackendResourcePicturePicture;
        }
      }
      sys: {
        menu: ExportBackendSysMenu;
        role: ExportBackendSysRole;
        setting: ExportBackendSysSetting;
        user: {
          user: ExportBackendSysUserUser;
        }
      }
    }
  }
}
