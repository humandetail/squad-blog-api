import BaseService from '../BaseService';
import { LoginDto } from '../../dto/common/auth';
import { Equal } from 'typeorm';
import Log from '../../entities/mongodb/sys/Log';

export const RedisTokenKey = 'squad-admin-token-';

export default class AuthService extends BaseService {
  // 校验用户名和密码
  async verifyUser ({ username, password }: LoginDto) {
    const user = await this.getRepo().sys.User.findOne({
      username: Equal(username)
    });

    if (!user || user.isShow !== 1) {
      return false;
    }

    // 校验密码
    if (this.getHelper().passwordEncrypt(password, user.salt) !== user.password) {
      return false;
    }

    if (user.isLock !== 0) {
      throw new Error('用户被锁定，禁止登录');
    }

    return user.id;
  }

  // 获取 token
  async getToken (id: string) {
    // 获取用户信息
    const user = await this.service.sys.user.getUserInfo(id);

    // 更新用户最后登录时间
    user.lastLogin = this.getHelper().now();

    const token = this.getHelper().jwtSign(user, { expiresIn: '24h' });

    // 存储 token 信息到 redis
    await this.getRedis().set(`${RedisTokenKey}${id}`, token);

    try {
      // 更新用户最后登录时间
      this.service.sys.user.update(id, { lastLogin: user.lastLogin }).catch(() => { /**/ });

      // 记录用户登录日志
      const log = new Log();
      log.action = 'login';
      log.content = '登录了系统';
      log.ip = this.getHelper().getIp();
      log.module = 'auth';
      log.result = 'success';
      log.username = user.username;
      this.getMongoDBManger().save(Log, log);
    } catch (e) {
      // ...
      console.log(e);
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
