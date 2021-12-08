import { isNull, isUndefined } from 'lodash';
import { Like, Not } from 'typeorm';
import { BaseToggleShowDto } from '../../../dto/common/common';
import { BatchPostCategoryDto, BatchPostDeleteDto, BatchPostShowDto, BatchPostTagDto, BatchPostTemplateDto, CreatePostDto, EBatchTagAction, QueryPostsDto, UpdatePostDto } from '../../../dto/post/post';
import { AdminRoute } from '../../../libs/decorators/RouterRegister';
import { formatPost } from '../../../libs/utils';
import BaseController from '../../BaseController';

export default class PostController extends BaseController {
  /**
   * @api {post} /posts 创建文章
   * @apiGroup Post - Post
   * @apiParam {String} title 标题
   * @apiParam {String} summary 摘要
   * @apiParam {String} content 内容
   * @apiParam {String} author 作者
   * @apiParam {String} source 来源
   * @apiParam {Number} recommendationIndex 推荐指数
   * @apiParam {String} seoTitle seo title
   * @apiParam {String} seoKeywords seo keywords
   * @apiParam {String} seoDescription seo description
   * @apiParam {Number} categoryId 外键-分类id
   * @apiParam {Number} coverId 外键-封面图id
   * @apiParam {Number} templateId 外键-模板id
   * @apiParam {Number[]} tags 标签集合
   * @apiUse BaseReq
   * @apiUse Auth
   * @apiUse BaseRes
   */
  @AdminRoute('post', '/posts')
  async create () {
    const { ctx, service } = this;

    const dto = await ctx.validate<CreatePostDto>(CreatePostDto);

    const exists = await service.post.post.findOne({ title: dto.title });

    if (exists) {
      this.res({
        code: -1,
        message: '文章标题已存在'
      });
      return;
    }

    await service.post.post.create(dto);

    this.res();
  }

  /**
   * @api {put} /posts/:id/show 更改文章显示状态
   * @apiGroup Post - Post
   * @apiParam {Number} isShow 1=显示；0=不显示
   * @apiUse Auth
   * @apiUse BaseRes
   */
  @AdminRoute('put', '/posts/:id/show')
  async edit () {
    const { ctx, service } = this;
    const { id } = this.getParams();
    const dto = await ctx.validate<BaseToggleShowDto>(BaseToggleShowDto);

    const result = await service.post.post.update(id, dto);

    if (!result) {
      this.res({
        code: 30001,
      });
      return;
    }
    this.res();
  }

  /**
   * @api {put} /posts/:id 修改文章
   * @apiGroup Post - Post
   * @apiParam {String} title 标题
   * @apiParam {String} summary 摘要
   * @apiParam {String} content 内容
   * @apiParam {String} author 作者
   * @apiParam {String} source 来源
   * @apiParam {Number} recommendationIndex 推荐指数
   * @apiParam {String} seoTitle seo title
   * @apiParam {String} seoKeywords seo keywords
   * @apiParam {String} seoDescription seo description
   * @apiParam {Number} categoryId 外键-分类id
   * @apiParam {Number} coverId 外键-封面图id
   * @apiParam {Number} templateId 外键-模板id
   * @apiParam {Number[]} tags 标签集合
   * @apiUse BaseReq
   * @apiUse Auth
   * @apiUse BaseRes
   */
  @AdminRoute('put', '/posts/:id')
  async update () {
    const { ctx, service } = this;

    const { id } = this.getParams();

    const dto = await ctx.validate<UpdatePostDto>(UpdatePostDto);

    const exists = await service.post.post.findOne({ id: Not(id), title: dto.title });

    if (exists) {
      this.res({
        code: -1,
        message: '标题已存在'
      });
      return;
    }

    const result = await service.post.post.update(id, dto);

    if (!result) {
      this.res({
        code: 30001
      });
      return;
    }

    this.res();
  }


  /**
   * @api {get} /posts/:id 获取文章详情
   * @apiGroup Post - Post
   * @apiUse Auth
   * @apiUse InfoRes
   * @apiSuccess {Object} data
   * @apiSuccess {String} data.title 标题
   * @apiSuccess {String} data.summary 摘要
   * @apiSuccess {String} data.content 内容
   * @apiSuccess {String} data.author 作者
   * @apiSuccess {String} data.source 来源
   * @apiSuccess {Number} data.recommendationIndex 推荐指数
   * @apiSuccess {String} data.seoTitle seo title
   * @apiSuccess {String} data.seoKeywords seo keywords
   * @apiSuccess {String} data.seoDescription seo description
   * @apiSuccess {Number} data.categoryId 外键-分类id
   * @apiSuccess {String} data.categoryName 分类名称
   * @apiSuccess {Number} data.coverId 外键-封面图id
   * @apiSuccess {String} data.coverPic 封面图url
   * @apiSuccess {Number} data.templateId 外键-模板id
   * @apiSuccess {Number} data.templateName 模板名称
   * @apiSuccess {Object[]} data.tags 标签集合
   * @apiSuccess {Number} data.tags.id 标签id
   * @apiSuccess {String} data.tags.displayName 标签显示名称
   */
  @AdminRoute('get', '/posts/:id')
  async show () {
    const { id } = this.getParams();

    const post = await this.service.post.post.findOne({ id }, [
      'tags',
      'category',
      'cover',
      'template'
    ]);

    if (!post) {
      this.res({
        code: 30001
      });
      return;
    }

    this.res({
      data: formatPost(post)
    });
  }

  /**
   * @api {get} /posts 获取文章列表
   * @apiGroup Post - Post
   * @apiUse PageReq
   * @apiUse Auth
   * @apiUse PageRes
   * @apiSuccess {Object} data
   * @apiSuccess {Object[]} data.records 查询数据列表
   * @apiSuccess {String} data.records.title 标题
   * @apiSuccess {String} data.records.summary 摘要
   * @apiSuccess {String} data.records.content 内容
   * @apiSuccess {String} data.records.author 作者
   * @apiSuccess {String} data.records.source 来源
   * @apiSuccess {Number} data.records.recommendationIndex 推荐指数
   * @apiSuccess {String} data.records.seoTitle seo title
   * @apiSuccess {String} data.records.seoKeywords seo keywords
   * @apiSuccess {String} data.records.seoDescription seo description
   * @apiSuccess {String} data.records.viewCount 浏览量
   * @apiSuccess {Number} data.records.categoryId 外键-分类id
   * @apiSuccess {String} data.records.categoryName 分类名称
   * @apiSuccess {Number} data.records.coverId 外键-封面图id
   * @apiSuccess {String} data.records.coverPic 封面图url
   * @apiSuccess {Number} data.records.templateId 外键-模板id
   * @apiSuccess {Number} data.records.templateName 模板名称
   * @apiSuccess {Object[]} data.records.tags 标签集合
   * @apiSuccess {Number} data.records.tags.id 标签id
   * @apiSuccess {String} data.records.tags.displayName 标签显示名称
   */
  @AdminRoute('get', '/posts')
  async index () {
    const { ctx, service } = this;

    const dto = await ctx.validate<QueryPostsDto>(QueryPostsDto, this.getQuery());

    const { categoryId, keyword, ...otherOptions } = dto;

    const where: any = {};

    if (categoryId) {
      const category = await this.service.post.category.findOne({ id: categoryId });
      where.category = category;
    }

    if (keyword) {
      where.title = Like(`%${keyword}%`);
    }

    const options = this.formatFindManyOptions(
      otherOptions,
      where
    );

    const [posts, total] = await service.post.post.find(options, [
      'tags',
      'category',
      'cover',
      'template'
    ], true);

    this.res({
      data: this.pageWrapper(
        posts.map(v => formatPost(v)),
        dto.current,
        dto.pageSize,
        total
      )
    });
  }

  /**
   * @api {delete} /posts/:id 删除文章
   * @apiGroup Post - Post
   * @apiUse Auth
   * @apiUse BaseRes
   */
  @AdminRoute('delete', '/posts/:id')
  async destroy () {
    const { id } = this.getParams();

    const result = await this.service.post.post.delete(id);

    if (!result) {
      this.res({ code: 30001 });
      return;
    }

    this.res();
  }

  /**
   * @api {post} /posts/batchCategory 批处理文章分类
   * @apiGroup Post - Post
   * @apiParam {Number} categoryId 需要修改的分类id,为0时表示所有
   * @apiParam {Number} newCategoryId 新的分类id
   * @apiParam {Boolean} [isAll] 是否对所有文章执行修改
   * @apiParam {String[]} [ids] id集合
   * @apiUse BaseReq
   * @apiUse Auth
   * @apiUse BaseRes
   */
  @AdminRoute('post', '/posts/batchCategory')
  async batchCategory () {
    const { ctx, service } = this;

    const dto = await ctx.validate<BatchPostCategoryDto>(BatchPostCategoryDto);

    if (!dto.isAll && (!dto.ids)) {
      this.res({
        code: 422,
        message: 'isAll 或 ids 字段必须存在其中之一'
      }, 422);
      return;
    }

    const result = await service.post.post.batchCategory(dto);

    if (!result) {
      this.res({
        code: 30001
      });
      return;
    }

    this.res();
  }

  /**
   * @api {post} /posts/batchTag 批处理文章标签
   * @apiGroup Post - Post
   * @apiParam {Number} [tagId] 需要修改的标签id,为0时表示所有
   * @apiParam {Number} newTagId 新的标签id
   * @apiParam {String} action 操作 "add" | "change" | "remove"，当为 "change" 时，`tagId`必填
   * @apiParam {Boolean} [isAll] 是否对所有文章执行修改
   * @apiParam {String[]} [ids] id集合
   * @apiUse BaseReq
   * @apiUse Auth
   * @apiUse BaseRes
   */
  @AdminRoute('post', '/posts/batchTag')
  async batchTag () {
    const { ctx, service } = this;

    const dto = await ctx.validate<BatchPostTagDto>(BatchPostTagDto);

    if (dto.action === EBatchTagAction.change && (isUndefined(dto.tagId) || isNull(dto.tagId))) {
      this.res({
        message: '`tagId` 字段不能为空'
      }, 422);
      return;
    }

    const result = await service.post.post.batchTag(dto);

    if (!result) {
      this.res({
        code: -1,
        message: '操作失败'
      });
      return;
    }

    this.res();
  }

  /**
   * @api {post} /posts/batchTemplate 批处理文章模板
   * @apiGroup Post - Post
   * @apiParam {Number} templateId 需要修改的模板id,为0时表示所有
   * @apiParam {Number} newTemplateId 新的模板id
   * @apiParam {Boolean} [isAll] 是否对所有文章执行修改
   * @apiParam {String[]} [ids] id集合
   * @apiUse BaseReq
   * @apiUse Auth
   * @apiUse BaseRes
   */
  @AdminRoute('post', '/posts/batchTemplate')
  async bacthTemplate () {
    const { ctx, service } = this;

    const dto = await ctx.validate<BatchPostTemplateDto>(BatchPostTemplateDto);

    if (!dto.isAll && (!dto.ids)) {
      this.res({
        code: 422,
        message: 'isAll 或 ids 字段必须存在其中之一'
      }, 422);
      return;
    }

    const result = await service.post.post.batchTemplate(dto);

    if (!result) {
      this.res({
        code: 30001
      });
      return;
    }

    this.res();
  }

  /**
   * @api {post} /posts/batchShow 批处理文章显示状态
   * @apiGroup Post - Post
   * @apiParam {Number} isShow 是否显示
   * @apiParam {Boolean} [isAll] 是否对所有文章执行修改
   * @apiParam {String[]} [ids] id集合
   * @apiUse BaseReq
   * @apiUse Auth
   * @apiUse BaseRes
   */
  @AdminRoute('post', '/posts/batchShow')
  async batchShow () {
    const { ctx, service } = this;

    const dto = await ctx.validate<BatchPostShowDto>(BatchPostShowDto);

    if (!dto.isAll && (!dto.ids)) {
      this.res({
        code: 422,
        message: 'isAll 或 ids 字段必须存在其中之一'
      }, 422);
      return;
    }

    const result = await service.post.post.batchShow(dto);

    if (!result) {
      this.res({
        code: 30001
      });
      return;
    }

    this.res();
  }

  /**
   * @api {post} /posts/batchDelete 批删除文章
   * @apiGroup Post - Post
   * @apiParam {Boolean} [isAll] 是否对所有文章执行修改
   * @apiParam {String[]} [ids] id集合
   * @apiUse BaseReq
   * @apiUse Auth
   * @apiUse BaseRes
   */
  @AdminRoute('post', '/posts/batchDelete')
  async batchDelete () {
    const { ctx, service } = this;

    const { ids } = await ctx.validate<BatchPostDeleteDto>(BatchPostDeleteDto);

    const result = await service.post.post.batchDelete(ids);

    if (!result) {
      this.res({
        code: 30001
      });
      return;
    }

    this.res();
  }
}
