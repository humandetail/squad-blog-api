// This file is created by egg-ts-helper@1.29.1
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportAdminAuthority from '../../../app/middleware/adminAuthority';
import ExportErrorHandler from '../../../app/middleware/errorHandler';

declare module 'egg' {
  interface IMiddleware {
    adminAuthority: typeof ExportAdminAuthority;
    errorHandler: typeof ExportErrorHandler;
  }
}
