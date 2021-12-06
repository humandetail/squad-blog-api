import { Application } from 'egg';

// 初始化配置信息
export async function initSetting (app: Application) {
  const ctx = app.createAnonymousContext();

  const setting = await ctx.service.sys.setting.findOne();

  if (!setting) {
    // 创建一个 配置信息
    const result = await ctx.service.sys.setting.create();

    if (!result) {
      throw new Error('创建配置信息失败');
    } else {
      console.log('[init setting]: 配置信息创建成功');
    }
  }
}
