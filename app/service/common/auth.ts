import BaseService from '../BaseService';
import User from '../../entities/mysql/sys/User';

export const RedisTokenKey = 'squad-admin-token-';
export const RedisPermissionKey = 'squad-admin-permission-';

export default class AuthService extends BaseService {
  // 获取 token
  async getToken (user: User) {
    // 获取用户信息
    const id = user.id;

    // 更新用户最后登录时间
    user.lastLogin = this.getHelper().now() as any;

    const token = this.getHelper().jwtSign(
      {
        id: user.id,
        username: user.username,
        isLock: user.isLock,
        isShow: user.isShow,
        roleId: user.role.id,
        lastLogin: user.lastLogin
      },
      { expiresIn: '24h' }
    );

    const permissions = await this.service.sys.menu.getPermissions(user.role.id);

    // 存储 token 信息到 redis
    await this.getRedis().set(`${RedisTokenKey}${id}`, token);
    // 存储权限信息到 redis
    await this.getRedis().set(`${RedisPermissionKey}${id}`, JSON.stringify(permissions));

    try {
      // 更新用户最后登录时间
      this.getRepo().sys.User.save(user);
    } catch (e) {
      this.ctx.logger.error(e);
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

  // 从 redis 中取出 permissions 信息
  async getPermissionFromRedis (id: string) {
    return await this.getRedis().get(`${RedisPermissionKey}${id}`);
  }

  // 从 redis 中删除 permissions 信息
  async removePermission (id: string) {
    return await this.getRedis().del(`${RedisPermissionKey}${id}`);
  }
}
