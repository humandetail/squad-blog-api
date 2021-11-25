import { isEmpty } from 'lodash';
import { Like } from 'typeorm';
import { ChangePasswordDto, CreateUserDto, QueryUsersDto, UpdateUserDto } from '../../../dto/sys/user';
import { AdminRoute } from '../../../libs/decorators/RouterRegister';
import BaseController from '../../BaseController';

export default class UserController extends BaseController {
  @AdminRoute('post', '/user')
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

  @AdminRoute('put', '/user/changePassword/:id')
  async changePassword () {
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

  @AdminRoute('put', '/user/:id')
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

    const dto = await ctx.validate<UpdateUserDto>(UpdateUserDto);

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

  @AdminRoute('get', '/user/:id')
  async getUser () {
    const { id } = this.getParams();
    const userInfo = await this.service.sys.user.getUserInfo(id);

    this.res({
      data: userInfo
    });
  }

  @AdminRoute('get', '/users')
  async getUsers () {
    const { ctx } = this;
    const dto = await ctx.validate<QueryUsersDto>(QueryUsersDto, this.getQuery());
    const { username, ...otherDtoProps } = dto;
    const options = this.formatFindManyOptions(otherDtoProps);

    const { users, total } = await this.service.sys.user.getUsers({
      ...(username ? { username: Like('%username') } : null),
      ...options
    });

    console.log(users);
    this.res({
      data: this.pageWrapper(users, dto.current, dto.pageSize, total)
    });
  }

  @AdminRoute('delete', '/user/:id')
  async delete () {
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
