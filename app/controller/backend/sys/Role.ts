import { Like, Not } from 'typeorm';
import { BaseToggleShowDto } from '../../../dto/common/common';
import { CreateRoleDto, QueryRolesDto, RoleMenusDto, UpdateRoleDto } from '../../../dto/sys/role';
import { AdminRoute } from '../../../libs/decorators/RouterRegister';
import BaseController from '../../BaseController';

export default class RoleController extends BaseController {
  /**
   * @api {post} /roles 创建角色
   * @apiGroup System - Role
   * @apiParam {String} name 角色名称
   * @apiParam {Number} [remarks] 备注信息
   * @apiUse BaseReq
   * @apiUse Auth
   * @apiUse BaseRes
   */
  @AdminRoute('post', '/roles')
  async create () {
    const { ctx, service } = this;

    const dto = await ctx.validate<CreateRoleDto>(CreateRoleDto);

    const exists = await service.sys.role.findOne({ name: dto.name });

    if (exists) {
      this.res({
        message: '角色已存在'
      }, 422);
      return;
    }

    await service.sys.role.create(dto);

    this.res();
  }

  /**
   * @api {put} /roles/:id/show 更改角色的显示状态
   * @apiGroup System - Role
   * @apiParam {Number} isShow 1=显示；0=不显示
   * @apiUse Auth
   * @apiUse BaseRes
   */
  @AdminRoute('put', '/roles/:id/show')
  async edit () {
    const { ctx, service } = this;
    const { id } = this.getParams();
    const dto = await ctx.validate<BaseToggleShowDto>(BaseToggleShowDto);

    const result = await service.sys.role.update(id, dto);

    if (!result) {
      this.res({
        code: 30001,
      });
      return;
    }
    this.res();
  }

  /**
   * @api {put} /roles/:id 修改角色
   * @apiGroup System - Role
   * @apiParam {String} name 角色名称
   * @apiParam {Number} [remarks] 备注信息
   * @apiUse BaseReq
   * @apiUse Auth
   * @apiUse BaseRes
   */
  @AdminRoute('put', '/roles/:id')
  async update () {
    const { ctx, service } = this;

    const { id } = this.getParams();

    const dto = await ctx.validate<UpdateRoleDto>(UpdateRoleDto);

    const exists = await service.sys.role.findOne({
      id: Not(id),
      name: dto.name
    });

    if (exists) {
      this.res({
        message: '角色名已存在'
      });
      return;
    }

    const result = await service.sys.role.update(id, dto);

    if (!result) {
      this.res({
        code: 30001
      });
      return;
    }

    this.res();
  }

  /**
   * @api {put} /roles/:id/authorizations 角色授权
   * @apiGroup System - Role
   * @apiParam {Number[]} menus 菜单id集合
   * @apiUse BaseReq
   * @apiUse Auth
   * @apiUse BaseRes
   */
  @AdminRoute('put', '/roles/:id/authorizations')
  async authorize () {
    const { ctx, service } = this;
    const { id } = this.getParams();

    const dto = await ctx.validate<RoleMenusDto>(RoleMenusDto);

    const result = await service.sys.role.update(id, dto);

    if (!result) {
      this.res({
        code: 30001
      });
      return;
    }

    this.res();
  }

  /**
   * @api {get} /roles 获取角色列表
   * @apiGroup System - Role
   * @apiUse Auth
   * @apiUse PageRes
   * @apiSuccess {Object} data
   * @apiSuccess {Object[]} data.records
   * @apiSuccess {String} data.records.name 角色名称
   * @apiSuccess {String} data.records.remarks 备注
   */
  @AdminRoute('get', '/roles')
  async index () {
    const { ctx } = this;
    const dto = await ctx.validate<QueryRolesDto>(QueryRolesDto, this.getQuery());

    const { keyword, ...otherOptions } = dto;

    const options = this.formatFindManyOptions(
      otherOptions,
      keyword ? { name: Like(`%${keyword}%`) } : null,
    );

    const [ roles, total ] = await this.service.sys.role.find(options);

    this.res({
      data: this.pageWrapper(
        roles.map(v => this.formatDateField(v)),
        dto.current,
        dto.pageSize,
        total
      )
    });
  }

  /**
   * @api {get} /roles/:id 获取角色详情
   * @apiGroup System - Role
   * @apiUse Auth
   * @apiUse InfoRes
   * @apiSuccess {Object} data
   * @apiSuccess {String} data.name 角色名称
   * @apiSuccess {String} data.remarks 备注
   */
  @AdminRoute('get', '/roles/:id')
  async show () {
    const { id } = this.getParams();

    const role = await this.service.sys.role.findOne({ id });

    if (!role) {
      this.res({
        code: 30001
      });
      return;
    }

    this.res({
      data: role
    });
  }

  /**
   * @api {delete} /roles/:id 删除角色
   * @apiGroup System - Role
   * @apiUse Auth
   * @apiUse BaseRes
   */
  @AdminRoute('delete', '/roles/:id')
  async destroy () {
    const { id } = this.getParams();

    const RoleService = this.service.sys.role;

    const exists = await RoleService.findOne({ id });

    if (!exists) {
      this.res({
        code: 30001
      });
      return;
    }

    const result = await RoleService.delete(id);

    if (!result) {
      this.res({
        code: 30004
      });
      return;
    }

    this.res();
  }
}
