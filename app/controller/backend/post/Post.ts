import { Like, Not } from 'typeorm';
import { BaseToggleShowDto } from '../../../dto/common/common';
import { CreatePostDto, QueryPostsDto, UpdatePostDto } from '../../../dto/post/post';
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
}
