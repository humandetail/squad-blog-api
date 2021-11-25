// 鉴权中间件
// 对所有的 /api/squad-admin 开始的路由进行校验

import { Context } from 'egg';

const prefix = '/api/squad-admin';
// 鉴权白名单
const whiteLists = [
  `${prefix}/login`, // 登录
];

export default function adminAuthority (): any {
  return async function (ctx: Context, next: () => Promise<any>) {
    const { url } = ctx;

    let code = 200;
    // 前缀未匹配 和 白名单直接放行
    if (!url.startsWith(prefix) || whiteLists.includes(url.split('?')[0])) {
      await next();
      return;
    }

    const token = ctx.get('Authorization').replace('Bearer ', '');

    try {
      ctx.token = ctx.helper.jwtVerify(token);
    } catch (e) {
      code = 401;
    }

    if (ctx.token) {
      // 校验 token 信息
      const rToken = await ctx.service.common.auth.getTokenFromRedis(ctx.token.id);

      if (rToken !== token) {
        code = 401;
      }
    }

    if (code > 200) {
      ctx.status = 200;
      ctx.body = {
        code,
        data: null,
        message: '请先登录'
      };
      return;
    }
    await next();
  };
}
