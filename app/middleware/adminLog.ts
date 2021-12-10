import { Context } from 'egg';

export default function adminLog (): any {
  return async function (ctx: Context, next: () => Promise<any>) {
    await next();

    const { url } = ctx;
    const action = ctx?.req?.method || '';
    const content = ctx.status !== 200 || ctx?.body?.code !== 200
      ? ctx.body
      : {
        params: ctx.params,
        body: ctx.request.body,
        query: ctx.request.query
      };

    const result = ctx.status === 200 && ctx?.body?.code === 200
      ? 'success'
      : 'failed';

    try {
      await ctx.service.sys.log.create({
        ip: ctx.helper.getIp(),
        username: ctx?.token?.username || '-',
        module: url,
        action,
        content,
        result
      });
    } catch (e) {
      // 日志记录失败
      ctx.logger.error(e);
    }
  };
}
