import { Context } from 'egg';
import * as _ from 'lodash';

// 错误处理中间件
export default function errorHandler (): any {
  return async (ctx: Context, next: () => Promise<any>) => {
    try {
      await next();
    } catch (err: any) {
      ctx.logger.error('[Exception]', err.message, err.errors);

      const status = err.status || 500;

      const message = status === 500 && ctx.app.config.env === 'prod'
        ? 'Internal Server Error!'
        : err.message;

      ctx.set('Content-Type', 'application/json');
      ctx.status = status;
      ctx.body = JSON.stringify({
        code: err.errorCode || err.status || 500,
        data: null,
        message: status === 422 && ctx.app.config.env !== 'prod' && err.errors
          ? formatErrors(err.errors)
          : message
      });
    }
  };
}

function formatErrors (errors: any) {
  if (typeof errors === 'string') {
    return errors;
  }

  if (_.isArray(errors)) {
    return [...new Set(errors.reduce((prev, item) => {
      return prev.concat(Object.values(item.constraints));
    }, []))].join(';');
  }

  return errors;
}
