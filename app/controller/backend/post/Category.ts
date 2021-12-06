import { Like } from 'typeorm';
import { BaseToggleShowDto } from '../../../dto/common/common';
import { PostCategoryDto, QueryPostCategoryDto } from '../../../dto/post/category';
import { AdminRoute } from '../../../libs/decorators/RouterRegister';
import BaseController from '../../BaseController';

export default class CategoryController extends BaseController {
  /**
   * @api {post} /categories 创建文章分类
   * @apiGroup Post - Category
   * @apiParam {String} name 分类名称
   * @apiParam {String} displayName 分类显示名称
   * @apiUse BaseReq
   * @apiUse Auth
   * @apiUse BaseRes
   */
  @AdminRoute('post', '/categories')
  async create () {
    const { ctx, service } = this;

    const dto = await ctx.validate<PostCategoryDto>(PostCategoryDto);

    const exists = await service.post.category.findOne([
      { name: dto.name },
      { displayName: dto.displayName }
    ]);

    if (exists) {
      this.res({
        code: -1,
        message: `${exists.name === dto.name ? '分类名称' : '分类显示名称'}已存在`
      });
      return;
    }

    await service.post.category.create(dto);
    this.res();
  }

  /**
   * @api {put} /categories/:id/show 更改文章分类显示状态
   * @apiGroup Post - Category
   * @apiParam {Number} isShow 1=显示；0=不显示
   * @apiUse Auth
   * @apiUse BaseRes
   */
  @AdminRoute('put', '/categories/:id/show')
  async edit () {
    const { ctx, service } = this;
    const { id } = this.getParams();
    const dto = await ctx.validate<BaseToggleShowDto>(BaseToggleShowDto);

    const result = await service.post.category.update(id, dto);

    if (!result) {
      this.res({
        code: 30001,
      });
      return;
    }
    this.res();
  }

  /**
   * @api {put} /categories/:id 修改文章分类
   * @apiGroup Post - Category
   * @apiParam {String} name 分类名称
   * @apiParam {String} displayName 分类显示名称
   * @apiUse BaseReq
   * @apiUse Auth
   * @apiUse BaseRes
   */
  @AdminRoute('put', '/categories/:id')
  async update () {
    const { ctx, service } = this;
    const { id } = this.getParams();

    const dto = await ctx.validate<PostCategoryDto>(PostCategoryDto);

    const exists = await service.post.category.findOne([
      { name: dto.name },
      { displayName: dto.displayName }
    ]);

    if (exists && exists.id !== parseInt(id)) {
      this.res({
        code: -1,
        message: `${exists.name === dto.name ? '分类名称' : '分类显示名称'}已存在`
      });
      return;
    }

    const result = await service.post.category.update(id, dto);

    if (!result) {
      this.res({
        code: 30001,
      });
      return;
    }
    this.res();
  }

  /**
   * @api {get} /categories 获取文章分类列表
   * @apiGroup Post - Category
   * @apiUse PageReq
   * @apiUse Auth
   * @apiUse PageRes
   * @apiSuccess {Object} data
   * @apiSuccess {Object[]} data.records 查询数据列表
   * @apiSuccess {String} data.records.name 分类名称
   * @apiSuccess {String} data.records.displayName 分类显示名称
   */
  @AdminRoute('get', '/categories')
  async index () {
    const { ctx, service } = this;

    const dto = await ctx.validate<QueryPostCategoryDto>(QueryPostCategoryDto, this.getQuery());

    const { keyword, ...otherOptions } = dto;
    const options = this.formatFindManyOptions(
      otherOptions,
      keyword
        ? [{ name: Like(`%${keyword}%`) }, { displayName: Like(`%${keyword}%`) }]
        : null
    );

    const [categories, total] = await service.post.category.getPictureCategoies(options);

    this.res({
      data: this.pageWrapper(
        categories.map(v => this.formateDateField(v)),
        dto.current,
        dto.pageSize,
        total
      )
    });
  }

  /**
   * @api {get} /categories/:id 获取文章分类详情
   * @apiGroup Post - Category
   * @apiUse Auth
   * @apiUse InfoRes
   * @apiSuccess {Object} data
   * @apiSuccess {String} data.name 分类名称
   * @apiSuccess {String} data.displayName 分类显示名称
   */
  @AdminRoute('get', '/categories/:id')
  async show () {
    const { id } = this.getParams();

    const category = await this.service.post.category.findOne({ id });

    if (!category) {
      this.res({
        code: 30001
      });
      return;
    }

    this.res({
      data: this.formateDateField(category)
    });
  }

  /**
   * @api {delete} /categories/:id 删除文章分类
   * @apiGroup Post - Category
   * @apiUse Auth
   * @apiUse BaseRes
   */
  @AdminRoute('delete', '/categories/:id')
  async destroy () {
    const { id } = this.getParams();

    const result = await this.service.post.category.delete(id);

    if (!result) {
      this.res({
        code: 30004
      });
      return;
    }
    this.res();
  }
}
