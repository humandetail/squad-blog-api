import { LoginDto } from '../../../dto/common/auth';
import { AdminRoute } from '../../../libs/decorators/RouterRegister';
import { formatUserInfo } from '../../../libs/utils';
import BaseController from '../../BaseController';

/**
 * 鉴权相关控制器
 */
export default class AuthController extends BaseController {
  /**
   * @api {post} /login 用户登录
   * @apiGroup Auth
   * @apiParam {String} username 用户名
   * @apiParam {String} password 密码
   * @apiUse BaseRes
   * @apiSuccess {String} data token
   */
  @AdminRoute('post', '/login')
  async login () {
    const { ctx } = this;
    const { username, password } = this.getBody();
    const dto = await ctx.validate<LoginDto>(LoginDto, {
      username,
      password: this.getHelper().rsaDecrypt(password) // 使用解密后数据
    });

    // 校验用户名或密码
    const user = await this.service.sys.user.findOne({ username: dto.username });

    if (!user || this.getHelper().passwordEncrypt(dto.password, user.salt) !== user.password) {
      this.res({
        code: 10001
      });
      return;
    }

    // 用户被隐藏
    if (user.isShow !== 1) {
      this.res({
        code: 10003
      });
      return;
    }

    // 用户被锁定
    if (user.isLock !== 0) {
      this.res({
        code: 10002
      });
      return;
    }

    const token = await this.service.common.auth.getToken(user);

    this.res({
      data: token
    });
  }

  /**
   * @api {get} /logout 退出登录
   * @apiGroup Auth
   * @apiUse Auth
   * @apiUse BaseRes
   */
  @AdminRoute('get', '/logout')
  async logout () {
    const { token } = this.ctx;

    if (!token) {
      this.res();
      return;
    }

    await this.service.common.auth.removeToken(token.id);
    this.res();
  }

  /**
   * @api {get} /getUserInfo 获取用户信息
   * @apiGroup Auth
   * @apiUse Auth
   * @apiUse InfoRes
   * @apiSuccess {Object} data 用户信息
   * @apiSuccess {String} data.id 主键id
   * @apiSuccess {String} data.username 用户名
   * @apiSuccess {Number} data.isLock 是否锁定
   * @apiSuccess {String} data.lastLogin 最后登录时间
   */
  @AdminRoute('get', '/getUserInfo')
  async getUserInfo () {
    const { token } = this.ctx;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const userInfo = await this.service.sys.user.findOne({ id: token.id }, true);
    if (!userInfo) {
      this.res({
        code: 30001
      });
      return;
    }
    this.res({
      data: formatUserInfo(userInfo)
    });
  }
}
