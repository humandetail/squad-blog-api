import { Application } from 'egg';
import * as _ from 'lodash';

// 初始化用户
export async function initUser (app: Application) {
  const ctx = app.createAnonymousContext();

  const [users, total] = await ctx.service.sys.user.getUsers({});
  const { getNanoid, passwordEncrypt, genRandomString, now } = ctx.helper;
  const salt = genRandomString();

  if (_.isEmpty(users) || total <= 0) {
    // 创建一个 admin 用户
    const result = await ctx.service.sys.user.create({
      id: getNanoid(),
      username: 'admin',
      password: passwordEncrypt.call(ctx.helper, 'abc@123', salt), // 保存加密后的密码
      salt,
      sort: 0,
      isLock: 0,
      isShow: 1,
      operator: 'admin',
      lastLogin: now()
    });

    if (!result) {
      throw new Error('创建用户失败');
    } else {
      console.log('[init user]: 用户创建成功');
    }
  }
}
