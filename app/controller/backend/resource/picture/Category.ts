import { Like } from 'typeorm';
import { BaseToggleShowDto } from '../../../../dto/common/common';
import { PictureCategoryDto, QueryPictureCategoryDto } from '../../../../dto/resource/picture/category';
import { AdminRoute } from '../../../../libs/decorators/RouterRegister';
import BaseController from '../../../BaseController';

export default class PictureCategoryController extends BaseController {
  /**
   * @api {post} /pictureCategories 创建图片分类
   * @apiGroup Resource - PictureCategory
   * @apiParam {String} name 分类名称
   * @apiParam {String} displayName 分类显示名称
   * @apiUse BaseReq
   * @apiUse Auth
   * @apiUse BaseRes
   */
  @AdminRoute('post', '/pictureCategories')
  async create () {
    const { ctx, service } = this;

    const dto = await ctx.validate<PictureCategoryDto>(PictureCategoryDto);

    const exists = await service.resource.pictureCategory.findOne([
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

    await service.resource.pictureCategory.create(dto);
    this.res();
  }

  /**
   * @api {put} /pictureCategories/:id/show 更改图片分类显示状态
   * @apiGroup Resource - PictureCategory
   * @apiParam {Number} isShow 1=显示；0=不显示
   * @apiUse Auth
   * @apiUse BaseRes
   */
  @AdminRoute('put', '/pictureCategories/:id/show')
  async edit () {
    const { ctx, service } = this;
    const { id } = this.getParams();
    const dto = await ctx.validate<BaseToggleShowDto>(BaseToggleShowDto);

    const result = await service.resource.pictureCategory.update(id, dto);

    if (!result) {
      this.res({
        code: 30001,
      });
      return;
    }
    this.res();
  }

  /**
   * @api {put} /pictureCategories/:id 修改图片分类
   * @apiGroup Resource - PictureCategory
   * @apiParam {String} name 分类名称
   * @apiParam {String} displayName 分类显示名称
   * @apiUse BaseReq
   * @apiUse Auth
   * @apiUse BaseRes
   */
  @AdminRoute('put', '/pictureCategories/:id')
  async update () {
    const { ctx, service } = this;
    const { id } = this.getParams();

    const dto = await ctx.validate<PictureCategoryDto>(PictureCategoryDto);

    const exists = await service.resource.pictureCategory.findOne([
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

    const result = await service.resource.pictureCategory.update(id, dto);

    if (!result) {
      this.res({
        code: 30001,
      });
      return;
    }
    this.res();
  }

  /**
   * @api {get} /pictureCategories 获取图片分类列表
   * @apiGroup Resource - PictureCategory
   * @apiUse PageReq
   * @apiUse Auth
   * @apiUse PageRes
   * @apiSuccess {Object} data
   * @apiSuccess {Object[]} data.records 查询数据列表
   * @apiSuccess {String} data.records.name 分类名称
   * @apiSuccess {String} data.records.displayName 分类显示名称
   */
  @AdminRoute('get', '/pictureCategories')
  async index () {
    const { ctx, service } = this;

    const dto = await ctx.validate<QueryPictureCategoryDto>(QueryPictureCategoryDto, this.getQuery());

    const { keyword, ...otherOptions } = dto;
    const options = this.formatFindManyOptions(
      otherOptions,
      keyword
        ? [{ name: Like(`%${keyword}%`) }, { displayName: Like(`%${keyword}%`) }]
        : null
    );

    const [categories, total] = await service.resource.pictureCategory.getPictureCategoies(options);

    this.res({
      data: this.pageWrapper(
        categories.map(v => this.formatDateField(v)),
        dto.current,
        dto.pageSize,
        total
      )
    });
  }

  /**
   * @api {get} /pictureCategories/:id 获取图片分类详情
   * @apiGroup Resource - PictureCategory
   * @apiUse Auth
   * @apiUse InfoRes
   * @apiSuccess {Object} data
   * @apiSuccess {String} data.name 分类名称
   * @apiSuccess {String} data.displayName 分类显示名称
   */
  @AdminRoute('get', '/pictureCategories/:id')
  async show () {
    const { id } = this.getParams();

    const category = await this.service.resource.pictureCategory.findOne({ id });

    if (!category) {
      this.res({
        code: 30001
      });
      return;
    }

    this.res({
      data: this.formatDateField(category)
    });
  }

  /**
   * @api {delete} /pictureCategories/:id 删除图片分类
   * @apiGroup Resource - PictureCategory
   * @apiUse Auth
   * @apiUse BaseRes
   */
  @AdminRoute('delete', '/pictureCategories/:id')
  async destroy () {
    const { id } = this.getParams();

    const result = await this.service.resource.pictureCategory.delete(id);

    if (!result) {
      this.res({
        code: 30004
      });
      return;
    }
    this.res();
  }
}
