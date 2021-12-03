import BaseService from '../BaseService';
import User from '../../entities/mysql/sys/User';

export const RedisTokenKey = 'squad-admin-token-';

export default class AuthService extends BaseService {
  // 获取 token
  async getToken (user: User) {
    // 获取用户信息
    // const user = await this.service.sys.user.getUserInfo(id);
    const id = user.id;

    // 更新用户最后登录时间
    user.lastLogin = this.getHelper().now() as any;

    const token = this.getHelper().jwtSign(
      {
        id: user.id,
        username: user.username,
        isLock: user.isLock,
        isShow: user.isShow,
        lastLogin: user.lastLogin
      },
      { expiresIn: '24h' }
    );

    // 存储 token 信息到 redis
    await this.getRedis().set(`${RedisTokenKey}${id}`, token);

    try {
      // 更新用户最后登录时间
      this.getRepo().sys.User.save(user);

      // // 记录用户登录日志
      // this.service.sys.log.create({
      //   ip: this.getHelper().getIp(),
      //   action: 'login',
      //   module: 'auth',
      //   content: '登录了系统',
      //   result: 'success',
      //   username: user.username
      // });
    } catch (e) {
      // eslint no-empty
    }

    return token;
  }

  // 从 redis 中取出 token 信息
  async getTokenFromRedis (id: string) {
    return await this.getRedis().get(`${RedisTokenKey}${id}`);
  }

  // 从 redis 中删除 token 信息
  async removeToken (id: string) {
    return await this.getRedis().del(`${RedisTokenKey}${id}`);
  }
}
