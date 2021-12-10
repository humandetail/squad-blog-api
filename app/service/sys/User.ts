import { CreateUserDto } from '../../dto/sys/user';
import BaseService, { IWhereCondition } from '../BaseService';
import User from '../../entities/mysql/sys/User';
import { FindManyOptions } from 'typeorm';

export interface IUserInfo extends CreateUserDto {
  id: string;
  salt: string;
  sort: number;
  isLock: number;
  isShow: number;
  operator: string;
  lastLogin: string;
}

export type IUpdateUserInfo = Partial<Pick<IUserInfo, 'isLock' | 'isShow' | 'sort' | 'operator' | 'lastLogin'>>;

export interface IUpdatePasswordInfo {
  password: string;
  newPassword: string;
}

export default class UserService extends BaseService {
  // 创建用户
  async create (userInfo: IUserInfo): Promise<boolean> {
    // 校验唯一性
    const { username } = userInfo;

    const exists = await this.getRepo().sys.User.findOne({ username });

    if (exists) {
      // 用户已存在
      return false;
    }

    // 开启事务
    await this.ctx.ormManager.transaction(async manager => {
      const user = manager.create(this.getEntity().sys.User, userInfo);

      if (userInfo.roleId) {
        const role = await this.getRepo().sys.Role.findOne({ id: userInfo.roleId });
        if (!role) {
          this.ctx.throw('角色不存在', 422);
        }
        user.role = role;
      }

      // 1. 添加用户
      await manager.save(user);

      const personalBase = manager.create(this.getEntity().personal.PersonalBase, {
        user,
        nickname: '',
        qq: '',
        blog: '',
        github: '',
        email: '',
        intro: '',
        operator: user.username,
        isShow: 1,
        isDefault: 1
      });

      // 2. 创建用户基本信息
      await manager.save(personalBase);
    });

    return true;
  }

  // 更新用户信息
  async update (
    id: string,
    userInfo: IUpdateUserInfo | IUpdatePasswordInfo,
    isUpdatePassword = false
  ): Promise<boolean> {
    const user = await this.getRepo().sys.User.findOne(id);

    if (!user) {
      return false;
    }

    if (isUpdatePassword) {
      // 更新密码操作
      const helper = this.getHelper();
      const { password, newPassword } = userInfo as IUpdatePasswordInfo;
      if (helper.passwordEncrypt.call(helper, password, user.salt) !== user.password) {
        this.ctx.throw(this.getHelper().getResMessage(10005), 10005);
      }

      user.password = helper.passwordEncrypt.call(helper, newPassword, user.salt);

      await this.getRepo().sys.User.save(user);

      return true;
    }

    // 更新用户信息操作
    const { isLock, isShow, sort, lastLogin, roleId } = userInfo as IUserInfo;

    if (roleId) {
      const role = await this.getRepo().sys.Role.findOne({ id: roleId });
      if (!role) {
        this.ctx.throw('角色不存在', 422);
      }
      user.role = role;
    }

    user.isLock = isLock ?? user.isLock;
    user.isShow = isShow ?? user.isShow;
    user.sort = sort ?? user.sort;
    user.operator = this.ctx?.token?.username || user.operator;
    user.lastLogin = (lastLogin ?? user.lastLogin) as any;

    await this.getRepo().sys.User.save(user);

    return true;
  }

  async findOne (where: IWhereCondition<User>, showPersonalBase = false) {
    const user = await this.getRepo().sys.User.findOne({ where });

    if (user && showPersonalBase) {
      const personalBase = await this.service.personal.base.findOne({ user, isDefault: 1, isShow: 1 }, ['avatar']);
      if (personalBase) {
        user.personalBases = [personalBase];
      }
    }

    return user;
  }

  // 分页查询
  async getUsers (options: FindManyOptions) {
    return this.getRepo().sys.User.findAndCount(options);
  }

  // 删除用户
  async delete (id: string) {
    const user = await this.getRepo().sys.User.findOne(id, {
      relations: ['personalBases']
    });
    if (!user) {
      throw new Error('用户不存在');
    }

    // 开启事务
    // 1. 删除用户
    // 2. 删除当前用户下所有个人信息
    await this.ctx.ormManager.transaction(async manager => {
      await manager.remove(this.getEntity().personal.PersonalBase, user.personalBases);
      await manager.remove(this.getEntity().sys.User, user);
    });

    return true;
  }
}
