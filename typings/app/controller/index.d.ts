// This file is created by egg-ts-helper@1.29.1
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportBaseController from '../../../app/controller/BaseController';
import ExportApiDocTest from '../../../app/controller/apiDocTest';
import ExportHome from '../../../app/controller/home';
import ExportBackendUserUser from '../../../app/controller/backend/user/User';

declare module 'egg' {
  interface IController {
    baseController: ExportBaseController;
    apiDocTest: ExportApiDocTest;
    home: ExportHome;
    backend: {
      user: {
        user: ExportBackendUserUser;
      }
    }
  }
}
