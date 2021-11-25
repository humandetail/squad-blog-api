// This file is created by egg-ts-helper@1.29.1
// Do not modify this file!!!!!!!!!

import 'egg';
type AnyClass = new (...args: any[]) => any;
type AnyFunc<T = any> = (...args: any[]) => T;
type CanExportFunc = AnyFunc<Promise<any>> | AnyFunc<IterableIterator<any>>;
type AutoInstanceType<T, U = T extends CanExportFunc ? T : T extends AnyFunc ? ReturnType<T> : T> = U extends AnyClass ? InstanceType<U> : U;
import ExportBaseService from '../../../app/service/BaseService';
import ExportCommonAuth from '../../../app/service/common/auth';
import ExportSysUser from '../../../app/service/sys/User';

declare module 'egg' {
  interface IService {
    baseService: AutoInstanceType<typeof ExportBaseService>;
    common: {
      auth: AutoInstanceType<typeof ExportCommonAuth>;
    }
    sys: {
      user: AutoInstanceType<typeof ExportSysUser>;
    }
  }
}
