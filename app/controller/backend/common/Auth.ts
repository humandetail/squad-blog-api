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
    const user = await this.service.sys.user.findOne({ username: dto.username }, ['role']);

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
   * @apiSuccess {String} data.nickName 用户昵称
   * @apiSuccess {String} data.avatarPic 用户头像url
   * @apiSuccess {Number} data.roleId 用户角色id
   * @apiSuccess {String} data.roleName 用户角色名称
   */
  @AdminRoute('get', '/getUserInfo')
  async getUserInfo () {
    const { token } = this.ctx;

    const userInfo = await this.service.sys.user.findOne({ id: token.id }, ['personalBases', 'role']);
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

  /**
   * @api {get} /getMenus 获取用户可访问菜单
   * @apiGroup Auth
   * @apiUse Auth
   * @apiUse InfoRes
   * @apiSuccess {Object[]} data
   * @apiSuccess {Number} data.parentId 上级菜单id
   * @apiSuccess {String} data.name 菜单/操作名称
   * @apiSuccess {Number} data.type 类型：1=菜单，2=操作
   * @apiSuccess {String} data.router 菜单路由，parentId 为0时，可以为空，表示目录菜单
   * @apiSuccess {String} data.permission 操作权限代码
   * @apiSuccess {String} data.path 组件路径，parentId 为0时，可以为空，表示目录菜单
   * @apiSuccess {String} data.icon 菜单图标
   * @apiSuccess {Number} data.isCache 是否缓存，1=是，0=否
   */
  @AdminRoute('get', '/getMenus')
  async getMenus () {
    const { ctx: { token }, service } = this;

    const menus = await service.sys.menu.getMenus(token.roleId);

    this.res({
      data: this.pageWrapper(menus.map(menu => this.formatDateField(menu)))
    });
  }

  /**
   * @api {get} /getPermissions 获取用户可操作的权限
   * @apiGroup Auth
   * @apiUse Auth
   * @apiUse InfoRes
   * @apiSuccess {String[]} data 权限列表
   */
  @AdminRoute('get', '/getPermissions')
  async getPermissions () {
    const { ctx: { token }, service } = this;

    const permissions = await service.sys.menu.getPermissions(token.roleId);

    this.res({
      data: permissions
    });
  }
}
