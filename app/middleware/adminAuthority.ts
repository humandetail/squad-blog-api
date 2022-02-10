// 鉴权中间件
// 对所有的 /api/squad-admin 开始的路由进行校验

import { Context } from 'egg';

import { ADMIN_PREFIX } from '../libs/decorators/RouterRegister';

const prefix = `/api${ADMIN_PREFIX}`;
// 鉴权白名单
const whiteLists = [
  `${prefix}/login`, // 登录
];
// 拥有 Token 可以访问的白名单
const whiteListsWithToken = [
  `${prefix}/getUserInfo`, // 获取用户信息
  `${prefix}/getMenus`, // 获取菜单
  `${prefix}/logout` // 退出登录
];

export default function adminAuthority (): any {
  return async function (ctx: Context, next: () => Promise<any>) {
    const { url } = ctx;

    // 前缀未匹配 和 白名单直接放行
    if (!url.startsWith(prefix) || whiteLists.includes(url.split('?')[0])) {
      await next();
      return;
    }

    const token = ctx.get('Authorization').replace('Bearer ', '');

    try {
      ctx.token = ctx.helper.jwtVerify(token);
    } catch (e) {
      ctx.status = 401;
      return;
    }

    if (ctx.token) {
      // 校验 token 信息
      const rToken = await ctx.service.common.auth.getTokenFromRedis(ctx.token.id);

      if (rToken !== token) {
        ctx.status = 401;
        return;
      }
    }

    // 检验接口权限
    const role = await ctx.service.sys.role.findOne({ id: ctx.token.roleId });
    if (!role) {
      ctx.status = 401;
      return;
    }

    // 拥有 Token 可以访问的白名单放行
    if (whiteListsWithToken.includes(url.split('?')[0])) {
      await next();
      return;
    }

    if (role.isAdmin) {
      // 超管账号直接放行
      await next();
      return;
    }
    const permissions = await ctx.service.sys.menu.getPermissions(ctx.token.roleId);

    const matchStr = `${ctx.method.toLowerCase()}|${url.split('?')[0].replace(prefix + '/', '').replace(/\//g, ':')}`;

    const hasPermission = permissions.some(permission => {
      if (permission === matchStr) {
        return true;
      }
      if (permission.includes('[id]')) {
        // get|posts:[id] => /^get\|posts:([A-z0-9]{10})$/
        // put|categories:[id]:show => /^put\|categories:(\d+):show$/
        const reg = new RegExp('^' + permission.replace(/\|/g, '\\|').replace('[id]', permission.includes('posts')
          ? '([A-z0-9]{10})'
          : '(\\d+)') + '$'
        );

        if (reg.test(matchStr)) {
          return true;
        }
      }
      return false;
    });

    if (!hasPermission) {
      ctx.status = 403;
      return;
    }
    await next();
  };
}
