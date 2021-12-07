import { Like } from 'typeorm';
import { BaseToggleShowDto } from '../../../dto/common/common';
import { CreateBlogrollDto, QueryBlogrollsDto, UpdateBlogrollDto } from '../../../dto/resource/blogroll';
import { AdminRoute } from '../../../libs/decorators/RouterRegister';
import BaseController from '../../BaseController';

export default class BlogrollController extends BaseController {
  /**
   * @api {post} /blogrolls 创建友情链接信息
   * @apiGroup Resource - Blogroll
   * @apiParam {String} name 名称
   * @apiParam {String} link 链接
   * @apiParam {String} remarks 备注
   * @apiUse BaseReq
   * @apiUse Auth
   * @apiUse BaseRes
   */
  @AdminRoute('post', '/blogrolls')
  async create () {
    const { ctx, service } = this;

    const dto = await ctx.validate<CreateBlogrollDto>(CreateBlogrollDto);

    // 校验名称或链接唯一性
    const exists = await service.resource.blogroll.findOne([{ name: dto.name }, { link: dto.link }]);

    if (exists) {
      ctx.status = 422;
      this.res({
        code: 422,
        message: `${exists.name === dto.name ? '名称' : '链接'}已存在`
      });
      return;
    }

    await service.resource.blogroll.create(dto);

    this.res();
  }

  /**
   * @api {put} /blogrolls/:id 修改友情链接
   * @apiGroup Resource - Blogroll
   * @apiParam {String} name 名称
   * @apiParam {String} link 链接
   * @apiParam {String} remarks 备注
   * @apiUse BaseReq
   * @apiUse Auth
   * @apiUse BaseRes
   */
  @AdminRoute('put', '/blogrolls/:id')
  async update () {
    const { ctx, service } = this;

    const { id } = this.getParams();

    const dto = await ctx.validate<UpdateBlogrollDto>(UpdateBlogrollDto);

    const result = await service.resource.blogroll.update(id, dto);

    if (!result) {
      this.res({
        code: 30001
      });
      return;
    }
    this.res();
  }

  /**
   * @api {put} /blogrolls/:id/show 更改友情链接显示状态
   * @apiGroup Resource - Blogroll
   * @apiParam {Number} isShow 是否显示
   * @apiUse Auth
   * @apiUse BaseRes
   */
  @AdminRoute('put', '/blogrolls/:id/show')
  async edit () {
    const { id } = this.getParams();

    const dto = await this.ctx.validate<BaseToggleShowDto>(BaseToggleShowDto);

    const result = await this.service.resource.blogroll.update(id, dto);
    if (!result) {
      this.res({
        code: 30001
      });
    } else {
      this.res();
    }
  }

  /**
   * @api {get} /blogrolls/:id 获取友情链接详情
   * @apiGroup Resource - Blogroll
   * @apiUse Auth
   * @apiUse InfoRes
   * @apiSuccess {Object} data
   * @apiSuccess {String} data.name 名称
   * @apiSuccess {String} data.link 链接
   * @apiSuccess {String} data.remarks 备注
   */
  @AdminRoute('get', '/blogrolls/:id')
  async show () {
    const { id } = this.getParams();

    const blogroll = await this.service.resource.blogroll.findOne({ id });

    if (!blogroll) {
      this.res({ code: 30001 });
      return;
    }

    this.res({
      data: this.formatDateField(blogroll)
    });
  }

  /**
   * @api {get} /personal/bases 获取友情链接列表
   * @apiGroup Personal - Base
   * @apiUse Auth
   * @apiUse InfoRes
   * @apiSuccess {Object} data
   * @apiSuccess {Object[]} data.records
   * @apiSuccess {String} data.records.name 技能名称
   * @apiSuccess {String} data.records.name 名称
   * @apiSuccess {String} data.records.link 链接
   * @apiSuccess {String} data.records.remarks 备注
   */
  @AdminRoute('get', '/blogrolls')
  async index () {
    const { ctx } = this;
    const dto = await ctx.validate<QueryBlogrollsDto>(QueryBlogrollsDto, this.getQuery());

    const { keyword, ...otherOptions } = dto;
    const options = this.formatFindManyOptions(
      otherOptions,
      keyword ? { name: Like(`%${keyword}%`) } : null
    );

    const [ blogrolls, total ] = await this.service.resource.blogroll.find(options);

    this.res({
      data: this.pageWrapper(
        blogrolls.map(v => this.formatDateField(v)),
        dto.current, dto.pageSize,
        total
      )
    });
  }

  /**
   * @api {delete} /blogrolls/:id 删除友情链接
   * @apiGroup Resource - Blogroll
   * @apiUse Auth
   * @apiUse BaseRes
   */
  @AdminRoute('delete', '/blogrolls/:id')
  async destroy () {
    const { id } = this.getParams();

    const result = await this.service.resource.blogroll.delete(id);

    if (!result) {
      this.res({
        code: 30001
      });
      return;
    }
    this.res();
  }
}
