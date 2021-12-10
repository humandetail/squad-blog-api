import { isEmpty, isNull, isUndefined } from 'lodash';
import { FindManyOptions } from 'typeorm';
import { CreateMenuDto, UpdateMenuDto } from '../../dto/sys/menu';
import Menu from '../../entities/mysql/sys/Menu';
import BaseService, { IWhereCondition } from '../BaseService';

export default class MenuService extends BaseService {
  async create (data: Required<CreateMenuDto>) {
    const MenuRepo = this.getRepo().sys.Menu;
    const exists = await MenuRepo.findOne({
      where: {
        name: data.name,
        parentId: data.parentId
      }
    });

    if (exists) {
      return false;
    }

    const menu = MenuRepo.create(data);

    menu.operator = this.ctx.token.username;

    await MenuRepo.save(menu);

    return true;
  }

  async update (id: number, data: Partial<UpdateMenuDto>) {
    const MenuRepo = this.getRepo().sys.Menu;

    const menu = await this.findOne({ id });

    if (!menu) {
      return false;
    }

    Object.entries(data).forEach(([key, value]) => {
      if (!isNull(value) || !isUndefined(value)) {
        menu[key] = value;
      }
    });

    await MenuRepo.save(menu);

    return true;
  }

  async find (options: FindManyOptions) {
    return this.getRepo().sys.Menu.findAndCount(options);
  }

  async findOne (where: IWhereCondition<Menu>) {
    return this.getRepo().sys.Menu.findOne({ where });
  }

  async findByParentId (parentId: number): Promise<Array<Menu & { hasChildren: boolean }>> {
    const MenuRepo = this.getRepo().sys.Menu;

    const menus = await MenuRepo.find({ parentId });

    if (isEmpty(menus)) {
      return [];
    }

    const retData: Array<Menu & { hasChildren: boolean }> = [];

    for (const menu of menus) {
      const hasChildren = await this.hasChildren(menu.id);
      retData.push({
        ...menu,
        hasChildren
      });
    }

    return retData;
  }

  async hasChildren (parentId: number) {
    const total = await this.getRepo().sys.Menu.count({ where: { parentId } });
    return total > 0;
  }

  async delete (id: number) {
    const { affected } = await this.getRepo().sys.Menu.delete(id);

    return !!affected;
  }

  async getMenus (roleId: number) {
    const role = await this.getRepo().sys.Role.findOne({ id: roleId });
    if (!role) {
      return [];
    }

    const builder = this.getRepo().sys.Menu.createQueryBuilder('menu')
      .leftJoinAndSelect('role_menus_menu', 'r', 'r.menuId = menu.id')
      .where('menu.type = 1');

    if (!role.isAdmin) {
      builder.andWhere('r.roleId = :id', { id: roleId });
    }

    const menus = await builder.getMany();

    return menus;
  }

  async getPermissions (roleId: number) {
    const role = await this.getRepo().sys.Role.findOne({ id: roleId });
    if (!role) {
      return [];
    }

    const builder = this.getRepo().sys.Menu.createQueryBuilder('menu')
      .leftJoinAndSelect('role_menus_menu', 'r', 'r.menuId = menu.id')
      .where('menu.type = 2');

    if (!role.isAdmin) {
      builder.andWhere('r.roleId = :id', { id: roleId });
    }

    const permissions = await builder.getMany();

    return permissions.map(v => v.permission);
  }
}
