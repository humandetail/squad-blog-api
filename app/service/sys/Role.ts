import { isNull, isUndefined, isEqual } from 'lodash';
import { FindManyOptions, In } from 'typeorm';
import { CreateRoleDto, RoleMenusDto, UpdateRoleDto } from '../../dto/sys/role';
import BaseService from '../BaseService';

export default class RoleService extends BaseService {
  async create (data: CreateRoleDto, initRole = false) {
    const RoleRepo = this.getRepo().sys.Role;

    const role = RoleRepo.create(data);

    role.remarks = data.remarks || '';
    role.operator = initRole ? '' : this.ctx.token.username;

    await RoleRepo.save(role);

    return true;
  }

  async update (id: number, { menus, ...data }: Partial<UpdateRoleDto & RoleMenusDto>) {
    const RoleRepo = this.getRepo().sys.Role;

    const roleRelations: string[] = ['users'];
    if (menus) {
      roleRelations.push('menus');
    }
    const role = await this.findOne({ id }, roleRelations);

    if (!role) {
      return false;
    }

    if (menus) {
      if (menus.length === 0) {
        // 清空所有权限
        role.menus = [];
        // 清除 redis 存储的内容
        for (const user of role.users) {
          await this.service.common.auth.removePermission(user.id);
        }
      } else {
        const roleMenus = await this.getRepo().sys.Menu.find({
          where: { id: In(menus) }
        });

        if (roleMenus.length === 0) {
          this.ctx.throw('权限列表获取失败', 422);
        }

        if (!isEqual(role.menus, roleMenus)) {
          // 清除 redis 存储的内容
          for (const user of role.users) {
            await this.service.common.auth.removePermission(user.id);
          }

          role.menus = roleMenus;
        }
      }
    }

    Object.entries(data).forEach(([key, value]) => {
      if (!isNull(value) || !isUndefined(value)) {
        role[key] = value;
      }
    });

    await RoleRepo.save(role);

    return true;
  }

  async find (options: FindManyOptions) {
    return this.getRepo().sys.Role.findAndCount({
      ...options,
      relations: ['menus']
    } as any);
  }

  async findOne (where: any, relations: string[] = []) {
    return this.getRepo().sys.Role.findOne({ where, relations });
  }

  async delete (id: number) {
    const { affected } = await this.getRepo().sys.Role.delete(id);

    return !!affected;
  }
}
