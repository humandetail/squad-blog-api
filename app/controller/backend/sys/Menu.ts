import { Like, Not } from 'typeorm';
import { BaseToggleShowDto, PageGetDto } from '../../../dto/common/common';
import { CreateMenuDto, QueryMenusDto, UpdateMenuDto } from '../../../dto/sys/menu';
import { AdminRoute } from '../../../libs/decorators/RouterRegister';
import BaseController from '../../BaseController';

export default class MenuController extends BaseController {
  /**
   * @api {post} /menus 创建菜单
   * @apiGroup System - Menu
   * @apiParam {Number} parentId 上级菜单id
   * @apiParam {String} name 菜单/操作名称
   * @apiParam {Number} type 类型：1=菜单，2=操作，类型为1时 router、path 必传，为2时 permission 必传
   * @apiParam {String} [router] 菜单路由，parentId 为0时，可以为空，表示目录菜单
   * @apiParam {String} [permission] 操作权限代码
   * @apiParam {String} [path] 组件路径，parentId 为0时，可以为空，表示目录菜单
   * @apiParam {String} [icon] 菜单图标
   * @apiParam {Number} [isCache] 是否缓存，1=是，0=否
   * @apiUse BaseReq
   * @apiUse Auth
   * @apiUse BaseRes
   */
  @AdminRoute('post', '/menus')
  async create () {
    const { ctx, service } = this;

    const {
      parentId,
      name,
      type,
      router,
      permission,
      path,
      icon,
      isCache,
      isShow,
      sort
    } = await ctx.validate<CreateMenuDto>(CreateMenuDto);

    const data: Required<CreateMenuDto> = {
      parentId,
      name,
      type,
      router: router || '',
      permission: '',
      path: path || '',
      icon: icon || '',
      isCache: isCache ?? 1, // 默认为 keepAlive
      isShow: isShow ?? 1, // 默认为 显示菜单
      sort: sort ?? 0
    };

    if (type === 1) {
      // if (parentId !== 0 && (!router || !path)) {
      //   this.res({
      //     message: '当类型为菜单时，页面路由和组件路径字段不能为空'
      //   }, 422);
      //   return;
      // }
      // data.router = parentId === 0 ? '' : router!;
      // data.path = parentId === 0 ? '' : path!;
    } else {
      if (!permission) {
        this.res({
          message: '当类型为操作时，权限代码字段不能为空'
        }, 422);
        return;
      }
      data.permission = permission;
    }

    const result = await service.sys.menu.create(data);

    if (!result) {
      this.res({
        code: 30001,
        message: '已存在的同级菜单'
      });
      return;
    }

    this.res();
  }

  /**
   * @api {put} /menus/:id/show 更改菜单的显示状态
   * @apiGroup System - Menu
   * @apiParam {Number} isShow 1=显示；0=不显示
   * @apiUse Auth
   * @apiUse BaseRes
   */
  @AdminRoute('put', '/menus/:id/show')
  async edit () {
    const { ctx, service } = this;
    const { id } = this.getParams();
    const dto = await ctx.validate<BaseToggleShowDto>(BaseToggleShowDto);

    const result = await service.sys.menu.update(id, dto);

    if (!result) {
      this.res({
        code: 30001,
      });
      return;
    }
    this.res();
  }

  /**
   * @api {put} /menus/:id 修改菜单
   * @apiGroup System - Menu
   * @apiParam {Number} parentId 上级菜单id
   * @apiParam {String} name 菜单/操作名称
   * @apiParam {Number} type 类型：1=菜单，2=操作，类型为1时 router、path 必传，为2时 permission 必传
   * @apiParam {String} [router] 菜单路由，parentId 为0时，可以为空，表示目录菜单
   * @apiParam {String} [permission] 操作权限代码
   * @apiParam {String} [path] 组件路径，parentId 为0时，可以为空，表示目录菜单
   * @apiParam {String} [icon] 菜单图标
   * @apiParam {Number} [isCache] 是否缓存，1=是，0=否
   * @apiUse BaseReq
   * @apiUse Auth
   * @apiUse BaseRes
   */
  @AdminRoute('put', '/menus/:id')
  async update () {
    const { ctx, service } = this;

    const { id } = this.getParams();

    const dto = await ctx.validate<UpdateMenuDto>(UpdateMenuDto);

    if (dto.type === 1) {
      // if (dto.parentId !== 0 && (!dto.router || !dto.path)) {
      //   this.res({
      //     message: '当类型为菜单时，页面路由和组件路径字段不能为空'
      //   }, 422);
      //   return;
      // }
    } else {
      if (!dto.permission) {
        this.res({
          message: '当类型为操作时，权限代码字段不能为空'
        }, 422);
        return;
      }
    }

    const exists = await service.sys.menu.findOne({
      id: Not(id),
      parentId: dto.parentId,
      name: dto.name
    });

    if (exists) {
      this.res({
        message: '同级别菜单名已存在'
      });
      return;
    }

    const result = await service.sys.menu.update(id, dto);

    if (!result) {
      this.res({
        code: 30001
      });
      return;
    }

    this.res();
  }

  /**
   * @api {get} /menus 获取菜单列表
   * @apiGroup System - Menu
   * @apiUse Auth
   * @apiUse InfoRes
   * @apiParam {Number} isAll 是否获取所有菜单，1=是，0=否，忽略分页参数
   * @apiSuccess {Object} data
   * @apiSuccess {Object[]} data.records
   * @apiSuccess {Number} data.records.parentId 上级菜单id
   * @apiSuccess {String} data.records.name 菜单/操作名称
   * @apiSuccess {Number} data.records.type 类型：1=菜单，2=操作
   * @apiSuccess {String} data.records.router 菜单路由，parentId 为0时，可以为空，表示目录菜单
   * @apiSuccess {String} data.records.permission 操作权限代码
   * @apiSuccess {String} data.records.path 组件路径，parentId 为0时，可以为空，表示目录菜单
   * @apiSuccess {String} data.records.icon 菜单图标
   * @apiSuccess {Number} data.records.isCache 是否缓存，1=是，0=否
   */
  @AdminRoute('get', '/menus')
  async index () {
    const { ctx } = this;
    const dto = await ctx.validate<QueryMenusDto>(QueryMenusDto, this.getQuery());

    const { isAll, keyword, ...otherOptions } = dto;

    const options = this.formatFindManyOptions(
      otherOptions,
      keyword ? { name: Like(`%${keyword}%`) } : null
    );

    const [ menus, total ] = await this.service.sys.menu.find(
      !isAll
        ? options
        : { where: keyword ? { name: Like(`%${keyword}%`) } : {} }
    );

    this.res({
      data: this.pageWrapper(
        menus.map(v => this.formatDateField(v)),
        isAll ? 0 : dto.current,
        isAll ? 0 : dto.pageSize,
        total
      )
    });
  }

  /**
   * @api {get} /menus/parentId/:id 获取下级菜单列表
   * @apiGroup System - Menu
   * @apiUse Auth
   * @apiUse InfoRes
   * @apiSuccess {Object} data
   * @apiSuccess {Object[]} data.records
   * @apiSuccess {Number} data.records.parentId 上级菜单id
   * @apiSuccess {String} data.records.name 菜单/操作名称
   * @apiSuccess {Number} data.records.type 类型：1=菜单，2=操作
   * @apiSuccess {String} data.records.router 菜单路由，parentId 为0时，可以为空，表示目录菜单
   * @apiSuccess {String} data.records.permission 操作权限代码
   * @apiSuccess {String} data.records.path 组件路径，parentId 为0时，可以为空，表示目录菜单
   * @apiSuccess {String} data.records.icon 菜单图标
   * @apiSuccess {Number} data.records.isCache 是否缓存，1=是，0=否
   * @apiSuccess {Boolean} data.records.hasChildren 是否有子菜单
   */
  @AdminRoute('get', '/menus/parentId/:id')
  async getMenusByParentId () {
    const { id } = this.getParams();
    const dto = await this.ctx.validate<PageGetDto>(PageGetDto, this.getQuery());

    const [menus, total] = await this.service.sys.menu.findByParentId(this.formatFindManyOptions(dto, { parentId: id }));

    this.res({
      data: this.pageWrapper(
        menus.map(v => this.formatDateField(v)),
        dto.current,
        dto.pageSize,
        total
      )
    });
  }

  /**
   * @api {get} /menus/:id 获取菜单详情
   * @apiGroup System - Menu
   * @apiUse Auth
   * @apiUse InfoRes
   * @apiSuccess {Number} data.parentId 上级菜单id
   * @apiSuccess {String} data.name 菜单/操作名称
   * @apiSuccess {Number} data.type 类型：1=菜单，2=操作
   * @apiSuccess {String} data.router 菜单路由，parentId 为0时，可以为空，表示目录菜单
   * @apiSuccess {String} data.permission 操作权限代码
   * @apiSuccess {String} data.path 组件路径，parentId 为0时，可以为空，表示目录菜单
   * @apiSuccess {String} data.icon 菜单图标
   * @apiSuccess {Number} data.isCache 是否缓存，1=是，0=否
   */
  @AdminRoute('get', '/menus/:id')
  async show () {
    const { id } = this.getParams();

    const menu = await this.service.sys.menu.findOne({ id });

    if (!menu) {
      this.res({
        code: 30001
      });
      return;
    }

    this.res({
      data: menu
    });
  }

  /**
   * @api {delete} /menus/:id 删除菜单
   * @apiGroup System - Menu
   * @apiUse Auth
   * @apiUse BaseRes
   */
  @AdminRoute('delete', '/menus/:id')
  async destroy () {
    const { id } = this.getParams();

    const MenuService = this.service.sys.menu;

    const exists = await MenuService.findOne({ id });

    if (!exists) {
      this.res({
        code: 30001
      });
      return;
    }

    const hasChildren = await MenuService.hasChildren(id);

    if (hasChildren) {
      this.res({
        code: 30005
      });
      return;
    }

    const result = await MenuService.delete(id);

    if (!result) {
      this.res({
        code: 30004
      });
      return;
    }

    this.res();
  }
}
