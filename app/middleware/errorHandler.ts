import { Context } from 'egg';

// 错误处理中间件
export default function errorHandler (): any {
  return async (ctx: Context, next: () => Promise<any>) => {
    try {
      await next();
    } catch (err) {
      ctx.logger.error('[Exception]', err.message, err.errors);

      const status = err.status || 500;

      const message = status === 500 && ctx.app.config.env === 'prod'
        ? 'Internal Server Error'
        : err.message;

      ctx.set('Content-Type', 'application/json');
      ctx.status = status;
      ctx.body = JSON.stringify({
        code: err.errorCode || err.status || 500,
        data: status === 422 && ctx.app.config.env !== 'prod'
          ? { errors: err.errors }
          : null,
        message
      });
    }
  };
}
