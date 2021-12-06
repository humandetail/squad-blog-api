// This file is created by egg-ts-helper@1.29.1
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportBaseController from '../../../app/controller/BaseController';
import ExportBackendCommonAuth from '../../../app/controller/backend/common/Auth';
import ExportBackendPersonalBase from '../../../app/controller/backend/personal/Base';
import ExportBackendPersonalSKill from '../../../app/controller/backend/personal/SKill';
import ExportBackendPersonalWork from '../../../app/controller/backend/personal/Work';
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
      resource: {
        picture: {
          category: ExportBackendResourcePictureCategory;
          picture: ExportBackendResourcePicturePicture;
        }
      }
      sys: {
        user: {
          user: ExportBackendSysUserUser;
        }
      }
    }
  }
}
