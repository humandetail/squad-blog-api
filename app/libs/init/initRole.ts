import { Application } from 'egg';
import * as _ from 'lodash';

// 初始化角色
export async function initRole (app: Application) {
  const ctx = app.createAnonymousContext();

  const [roles, total] = await ctx.service.sys.role.find({});

  if (_.isEmpty(roles) || total <= 0) {
    // 创建一个 超级管理员 角色
    const result = await ctx.service.sys.role.create({
      name: '超级管理员',
      remarks: '最高权限角色',
      isShow: 1,
      isAdmin: true,
      sort: 999
    }, true);

    if (!result) {
      throw new Error('创建角色失败');
    } else {
      console.log('[init role]: 角色创建成功');
    }
  }
}
