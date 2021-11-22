/**
 * 路由注册
 */

import { Application, Context } from 'egg';

export type HttpMethods = 'get' | 'post' | 'put' | 'delete' | 'patch' | 'options' | 'head';

export interface IRouteOptions {
  method: HttpMethods;
  url: string;
  handlerName: string;
  constructorFn: any;
  className: string;
  middlewares: any[];
}

export const ADMIN_PREFIX = '/squad-admin';

const __ROUTER__: {
  [key: string]: IRouteOptions[]
} = {};

/**
 * 推入路由
 * @param name -
 * @param options -
 */
function _setRouter (name: string, options: IRouteOptions): void {
  __ROUTER__[name] = __ROUTER__[name] || [];
  __ROUTER__[name].push(options);
}

export function registerRouter ({ router }: Application) {
  Object.keys(__ROUTER__).forEach(name => {
    __ROUTER__[name].forEach(({
      method,
      url,
      handlerName,
      constructorFn,
      middlewares
    }) => {
      router[method](url, ...middlewares, async (ctx: Context) => {
        const Ctor = new constructorFn(ctx);
        await Ctor[handlerName].call(Ctor);
      });
    });
  });
}

/**
 * 装饰器 - 前台
 */
export function Route (
  method: HttpMethods,
  url: string,
  middlewares: any[] = []
) {
  return function (target: any, funcName: string) {
    _setRouter(url, {
      method,
      url,
      middlewares,
      handlerName: funcName,
      constructorFn: target.constructor,
      className: target.constructor.name
    });
  };
}

/**
 * 装饰器 - 后台
 */
export function AdminRoute (
  method: HttpMethods,
  url: string,
  middlewares: any[] = []
) {
  return function (target: any, funcName: string) {
    _setRouter(url, {
      method,
      url: `${ADMIN_PREFIX}${url}`,
      middlewares,
      handlerName: funcName,
      constructorFn: target.constructor,
      className: target.constructor.name
    });
  };
}

export default registerRouter;
