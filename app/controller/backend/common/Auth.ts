import { LoginDto } from '../../../dto/common/auth';
import { AdminRoute } from '../../../libs/decorators/RouterRegister';
import BaseController from '../../BaseController';

/**
 * 鉴权相关控制器
 */
export default class AuthController extends BaseController {
  @AdminRoute('post', '/login')
  async login () {
    const { ctx } = this;
    const { username, password } = this.getBody();
    const dto = await ctx.validate<LoginDto>(LoginDto, {
      username,
      password: this.getHelper().rsaDecrypt(password) // 使用解密后数据
    });

    // 校验用户名或密码
    // 成功后会返回用户的 id
    const id = await this.service.common.auth.verifyUser(dto);

    if (!id) {
      throw new Error('用户名或密码错误');
    }

    const token = await this.service.common.auth.getToken(id);

    this.res({
      data: token
    });
  }

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

  @AdminRoute('get', '/getUserInfo')
  async getUserInfo () {
    const { token } = this.ctx;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { iat, exp, ...data } = token;
    this.res({
      data
    });
  }
}
