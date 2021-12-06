import { Like } from 'typeorm';
import { BaseToggleShowDto } from '../../../dto/common/common';
import { PostTagDto, QueryPostTagDto } from '../../../dto/post/tag';
import { AdminRoute } from '../../../libs/decorators/RouterRegister';
import BaseController from '../../BaseController';

export default class TagController extends BaseController {
  /**
   * @api {post} /tags 创建文章标签
   * @apiGroup Post - Tag
   * @apiParam {String} name 标签名称
   * @apiParam {String} displayName 标签显示名称
   * @apiUse BaseReq
   * @apiUse Auth
   * @apiUse BaseRes
   */
  @AdminRoute('post', '/tags')
  async create () {
    const { ctx, service } = this;

    const dto = await ctx.validate<PostTagDto>(PostTagDto);

    const exists = await service.post.tag.findOne([
      { name: dto.name },
      { displayName: dto.displayName }
    ]);

    if (exists) {
      this.res({
        code: -1,
        message: `${exists.name === dto.name ? '标签名称' : '标签显示名称'}已存在`
      });
      return;
    }

    await service.post.tag.create(dto);
    this.res();
  }

  /**
   * @api {put} /tags/:id/show 更改文章标签显示状态
   * @apiGroup Post - Tag
   * @apiParam {Number} isShow 1=显示；0=不显示
   * @apiUse Auth
   * @apiUse BaseRes
   */
  @AdminRoute('put', '/tags/:id/show')
  async edit () {
    const { ctx, service } = this;
    const { id } = this.getParams();
    const dto = await ctx.validate<BaseToggleShowDto>(BaseToggleShowDto);

    const result = await service.post.tag.update(id, dto);

    if (!result) {
      this.res({
        code: 30001,
      });
      return;
    }
    this.res();
  }

  /**
   * @api {put} /tags/:id 修改文章标签
   * @apiGroup Post - Tag
   * @apiParam {String} name 标签名称
   * @apiParam {String} displayName 标签显示名称
   * @apiUse BaseReq
   * @apiUse Auth
   * @apiUse BaseRes
   */
  @AdminRoute('put', '/tags/:id')
  async update () {
    const { ctx, service } = this;
    const { id } = this.getParams();

    const dto = await ctx.validate<PostTagDto>(PostTagDto);

    const exists = await service.post.tag.findOne([
      { name: dto.name },
      { displayName: dto.displayName }
    ]);

    if (exists && exists.id !== parseInt(id)) {
      this.res({
        code: -1,
        message: `${exists.name === dto.name ? '标签名称' : '标签显示名称'}已存在`
      });
      return;
    }

    const result = await service.post.tag.update(id, dto);

    if (!result) {
      this.res({
        code: 30001,
      });
      return;
    }
    this.res();
  }

  /**
   * @api {get} /tags 获取文章标签列表
   * @apiGroup Post - Tag
   * @apiUse PageReq
   * @apiUse Auth
   * @apiUse PageRes
   * @apiSuccess {Object} data
   * @apiSuccess {Object[]} data.records 查询数据列表
   * @apiSuccess {String} data.records.name 标签名称
   * @apiSuccess {String} data.records.displayName 标签显示名称
   */
  @AdminRoute('get', '/tags')
  async index () {
    const { ctx, service } = this;

    const dto = await ctx.validate<QueryPostTagDto>(QueryPostTagDto, this.getQuery());

    const { keyword, ...otherOptions } = dto;
    const options = this.formatFindManyOptions(
      otherOptions,
      keyword
        ? [{ name: Like(`%${keyword}%`) }, { displayName: Like(`%${keyword}%`) }]
        : null
    );

    const [tags, total] = await service.post.tag.getPictureCategoies(options);

    this.res({
      data: this.pageWrapper(
        tags.map(v => this.formateDateField(v)),
        dto.current,
        dto.pageSize,
        total
      )
    });
  }

  /**
   * @api {get} /tags/:id 获取文章标签详情
   * @apiGroup Post - Tag
   * @apiUse Auth
   * @apiUse InfoRes
   * @apiSuccess {Object} data
   * @apiSuccess {String} data.name 标签名称
   * @apiSuccess {String} data.displayName 标签显示名称
   */
  @AdminRoute('get', '/tags/:id')
  async show () {
    const { id } = this.getParams();

    const tag = await this.service.post.tag.findOne({ id });

    if (!tag) {
      this.res({
        code: 30001
      });
      return;
    }

    this.res({
      data: this.formateDateField(tag)
    });
  }

  /**
   * @api {delete} /tags/:id 删除文章标签
   * @apiGroup Post - Tag
   * @apiUse Auth
   * @apiUse BaseRes
   */
  @AdminRoute('delete', '/tags/:id')
  async destroy () {
    const { id } = this.getParams();

    const result = await this.service.post.tag.delete(id);

    if (!result) {
      this.res({
        code: 30004
      });
      return;
    }
    this.res();
  }
}
