import { isEmpty } from 'lodash';
import { Like } from 'typeorm';
import { ChangePasswordDto, CreateUserDto, QueryUsersDto, LockUserDto } from '../../../../dto/sys/user';
import { AdminRoute } from '../../../../libs/decorators/RouterRegister';
import { formatUserInfo } from '../../../../libs/utils';
import BaseController from '../../../BaseController';

export default class UserController extends BaseController {
  /**
   * @api {post} /users 创建用户
   * @apiGroup System - User
   * @apiParam {String} username 用户名
   * @apiParam {String} password 密码
   * @apiUse Auth
   * @apiUse BaseRes
   */
  @AdminRoute('post', '/users')
  async create () {
    const { ctx } = this;

    const { username, password } = this.getBody();
    const { rsaDecrypt, passwordEncrypt, getNanoid, genRandomString, now } = this.getHelper();

    // 校验参数
    const dto = await ctx.validate<CreateUserDto>(CreateUserDto, {
      username,
      password: rsaDecrypt(password) // 使用解密后数据
    });

    const salt = genRandomString();

    const result = await this.service.sys.user.create({
      id: getNanoid(),
      username,
      password: passwordEncrypt.call(this.getHelper(), dto.password, salt), // 保存加密后的密码
      salt,
      sort: 0,
      isLock: 0,
      isShow: 1,
      operator: username,
      lastLogin: now()
    });

    if (result) {
      this.res();
    } else {
      this.res({
        code: 422,
        message: '用户名已存在'
      });
    }
  }

  /**
   * @api {put} /users/:id/password 修改用户密码
   * @apiGroup System - User
   * @apiParam {String} password 原密码
   * @apiParam {String} newPassword 新密码
   * @apiUse Auth
   * @apiUse BaseRes
   */
  @AdminRoute('put', '/users/:id/password')
  async edit () {
    const { ctx } = this;

    const { id } = this.getParams();
    const { password, newPassword } = this.getBody();
    const { rsaDecrypt } = this.getHelper();

    const dto = await ctx.validate<ChangePasswordDto>(ChangePasswordDto, {
      password: rsaDecrypt(password),
      newPassword: rsaDecrypt(newPassword)
    });

    const result = await this.service.sys.user.update(id, dto, true);
    if (!result) {
      this.res({
        code: 422,
        message: '用户不存在或密码错误'
      });
    } else {
      this.res();
    }
  }

  /**
   * @api {put} /users/:id/lock 锁定/解锁用户
   * @apiGroup System - User
   * @apiParam {String} isLock 是否锁定用户
   * @apiUse Auth
   * @apiUse BaseRes
   */
  @AdminRoute('put', '/users/:id/lock')
  async update () {
    const { ctx } = this;

    const { id } = this.getParams();

    if (isEmpty(this.getBody())) {
      this.res({
        code: 422,
        message: '请求参数不能为空'
      });
      return;
    }

    const dto = await ctx.validate<LockUserDto>(LockUserDto);

    const result = await this.service.sys.user.update(id, dto);

    if (!result) {
      this.res({
        code: 422,
        message: '用户不存在'
      });
    } else {
      this.res();
    }
  }

  /**
   * @api {get} /users/:id 获取用户详情
   * @apiGroup System - User
   * @apiUse Auth
   * @apiUse InfoRes
   * @apiSuccess {Object} data
   * @apiSuccess {String} data.username 用户名
   * @apiSuccess {number} data.isLock 是否锁定
   * @apiSuccess {String} data.lastLogin 最后登录时间
   */
  @AdminRoute('get', '/users/:id')
  async show () {
    const { id } = this.getParams();
    const userInfo = await this.service.sys.user.findOne({ id });

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
   * @api {get} /users 获取用户列表
   * @apiGroup System - User
   * @apiSuccess {Object} data
   * @apiSuccess {Object[]} data.records
   * @apiSuccess {String} data.records.username 用户名
   * @apiSuccess {number} data.records.isLock 是否锁定
   * @apiSuccess {String} data.records.lastLogin 最后登录时间
   * @apiUse PageReq
   * @apiUse Auth
   * @apiUse PageRes
   */
  @AdminRoute('get', '/users')
  async index () {
    const { ctx } = this;
    const dto = await ctx.validate<QueryUsersDto>(QueryUsersDto, this.getQuery());
    const { username, ...otherDtoProps } = dto;
    const options = this.formatFindManyOptions(
      otherDtoProps,
      username ? { username: Like(`%${username}%`) } : null
    );

    const [ users, total ] = await this.service.sys.user.getUsers(options);

    this.res({
      data: this.pageWrapper(users.map(v => formatUserInfo(v)), dto.current, dto.pageSize, total)
    });
  }

  /**
   * @api {delete} /users/:id 删除用户
   * @apiGroup System - User
   * @apiUse Auth
   * @apiUse BaseRes
   */
  @AdminRoute('delete', '/users/:id')
  async destroy () {
    const { id } = this.getParams();
    const result = await this.service.sys.user.delete(id);
    if (!result) {
      this.res({
        code: 422,
        message: '用户不存在'
      });
    } else {
      this.res();
    }
  }
}
