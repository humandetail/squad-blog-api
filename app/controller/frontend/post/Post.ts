import { Like } from 'typeorm';
import { FrontendPageGetDto } from '../../../dto/common/common';
import { Route } from '../../../libs/decorators/RouterRegister';
import { formatFrontendPost, formatFrontendPostDetail } from '../../../libs/utils';
import BaseController from '../../BaseController';

/**
 * 鉴权相关控制器
 */
export default class CommonController extends BaseController {

  /**
   * @api {get} /frontend-service/posts/recommended 获取推荐文章列表
   * @apiGroup Frontend - Post
   * @apiUse FrontendPageReq
   * @apiUse PageRes
   * @apiSuccess {Object} data
   * @apiSuccess {Object[]} data.records 查询数据列表
   * @apiSuccess {String} data.records.title 标题
   * @apiSuccess {String} data.records.summary 摘要
   * @apiSuccess {String} data.records.author 作者
   * @apiSuccess {Number} data.records.recommendationIndex 推荐指数
   * @apiSuccess {String} data.records.viewCount 浏览量
   * @apiSuccess {String} data.records.categoryName 分类名称
   * @apiSuccess {Number} data.records.categoryDisplayName 分类显示名称
   * @apiSuccess {String} data.records.coverPic 封面图url
   * @apiSuccess {Object[]} data.records.tags 标签集合
   * @apiSuccess {Number} data.records.tags.id 标签id
   * @apiSuccess {String} data.records.tags.displayName 标签显示名称
   */
  @Route('get', '/frontend-service/posts/recommended')
  async getRecommendedPosts () {
    const { ctx, service } = this;

    const dto = await ctx.validate<FrontendPageGetDto>(FrontendPageGetDto, this.getQuery());

    const options = this.formatFindManyOptions(
      {
        ...dto,
        sortField: 'recommendationIndex',
        sortDesc: true
      },
      { isShow: 1 }
    );

    const [posts] = await service.post.post.find(options, [
      'tags',
      'category',
      'cover'
    ], true);

    this.res({
      data: this.pageWrapper(
        posts.map(v => formatFrontendPost(v)),
        dto.current,
        dto.pageSize,
        -1
      )
    });
  }

  /**
   * @api {get} /frontend-service/posts/new 获取最新文章列表
   * @apiGroup Frontend - Post
   * @apiUse FrontendPageReq
   * @apiUse PageRes
   * @apiSuccess {Object} data
   * @apiSuccess {Object[]} data.records 查询数据列表
   * @apiSuccess {String} data.records.title 标题
   * @apiSuccess {String} data.records.summary 摘要
   * @apiSuccess {String} data.records.author 作者
   * @apiSuccess {Number} data.records.recommendationIndex 推荐指数
   * @apiSuccess {String} data.records.viewCount 浏览量
   * @apiSuccess {String} data.records.categoryName 分类名称
   * @apiSuccess {Number} data.records.categoryDisplayName 分类显示名称
   * @apiSuccess {String} data.records.coverPic 封面图url
   * @apiSuccess {Object[]} data.records.tags 标签集合
   * @apiSuccess {Number} data.records.tags.id 标签id
   * @apiSuccess {String} data.records.tags.displayName 标签显示名称
   */
  @Route('get', '/frontend-service/posts/new')
  async getNewPosts () {
    const { ctx, service } = this;

    const dto = await ctx.validate<FrontendPageGetDto>(FrontendPageGetDto, this.getQuery());

    const options = this.formatFindManyOptions(
      {
        ...dto,
        sortField: 'createdTime',
        sortDesc: true
      },
      { isShow: 1 }
    );

    const [posts, total] = await service.post.post.find(options, [
      'tags',
      'category',
      'cover'
    ], true);

    this.res({
      data: this.pageWrapper(
        posts.map(v => formatFrontendPost(v)),
        dto.current,
        dto.pageSize,
        total
      )
    });
  }

  /**
   * @api {get} /frontend-service/posts/search 搜索文章
   * @apiGroup Frontend - Post
   * @apiUse FrontendPageReq
   * @apiUse PageRes
   * @apiSuccess {Object} data
   * @apiSuccess {Object[]} data.records 查询数据列表
   * @apiSuccess {String} data.records.title 标题
   * @apiSuccess {String} data.records.summary 摘要
   * @apiSuccess {String} data.records.author 作者
   * @apiSuccess {Number} data.records.recommendationIndex 推荐指数
   * @apiSuccess {String} data.records.viewCount 浏览量
   * @apiSuccess {String} data.records.categoryName 分类名称
   * @apiSuccess {Number} data.records.categoryDisplayName 分类显示名称
   * @apiSuccess {String} data.records.coverPic 封面图url
   * @apiSuccess {Object[]} data.records.tags 标签集合
   * @apiSuccess {Number} data.records.tags.id 标签id
   * @apiSuccess {String} data.records.tags.displayName 标签显示名称
   */
  @Route('get', '/frontend-service/posts/search')
  async getPostsByKeyword () {
    const { ctx, service } = this;

    const dto = await ctx.validate<FrontendPageGetDto>(FrontendPageGetDto, this.getQuery());

    const { keyword, ...otherOptions } = dto;

    if (!keyword) {
      return this.res(undefined, 422);
    }

    const options = this.formatFindManyOptions(
      {
        ...otherOptions,
        sortField: 'createdTime',
        sortDesc: true
      },
      [
        {
          isShow: 1,
          title: Like(`%${keyword}%`)
        },
        {
          isShow: 1,
          summary: Like(`%${keyword}%`)
        },
      ]
    );

    const [posts, total] = await service.post.post.find(options, [
      'tags',
      'category',
      'cover'
    ], true);

    this.res({
      data: this.pageWrapper(
        posts.map(v => formatFrontendPost(v)),
        dto.current,
        dto.pageSize,
        total
      )
    });
  }

  /**
   * @api {get} /frontend-service/categories/:name/posts 获取分类下的文章列表
   * @apiGroup Frontend - Post
   * @apiUse FrontendPageReq
   * @apiUse PageRes
   * @apiSuccess {Object} data
   * @apiSuccess {Object[]} data.records 查询数据列表
   * @apiSuccess {String} data.records.title 标题
   * @apiSuccess {String} data.records.summary 摘要
   * @apiSuccess {String} data.records.author 作者
   * @apiSuccess {Number} data.records.recommendationIndex 推荐指数
   * @apiSuccess {String} data.records.viewCount 浏览量
   * @apiSuccess {String} data.records.categoryName 分类名称
   * @apiSuccess {Number} data.records.categoryDisplayName 分类显示名称
   * @apiSuccess {String} data.records.coverPic 封面图url
   * @apiSuccess {Object[]} data.records.tags 标签集合
   * @apiSuccess {Number} data.records.tags.id 标签id
   * @apiSuccess {String} data.records.tags.displayName 标签显示名称
   */
  @Route('get', '/frontend-service/categories/:name/posts')
  async getPostByCategoryName () {
    const { ctx, service } = this;

    const dto = await ctx.validate<FrontendPageGetDto>(FrontendPageGetDto, this.getQuery());
    const { name } = this.getParams();

    const category = await service.post.category.findOne({
      name,
    });
    if (!category) {
      this.res(undefined, 422);
      return;
    }

    const options = this.formatFindManyOptions(
      {
        ...dto,
        sortField: 'createdTime',
        sortDesc: true
      },
      {
        isShow: 1,
        category: category.id
      }
    );

    const [posts, total] = await service.post.post.find(options, [
      'tags',
      'category',
      'cover'
    ], true);

    this.res({
      data: this.pageWrapper(
        posts.map(v => formatFrontendPost(v)),
        dto.current,
        dto.pageSize,
        total
      )
    });
  }

  /**
   * @api {get} /frontend-service/tags/:name/posts 获取标签下的文章列表
   * @apiGroup Frontend - Post
   * @apiUse FrontendPageReq
   * @apiUse PageRes
   * @apiSuccess {Object} data
   * @apiSuccess {Object[]} data.records 查询数据列表
   * @apiSuccess {String} data.records.title 标题
   * @apiSuccess {String} data.records.summary 摘要
   * @apiSuccess {String} data.records.author 作者
   * @apiSuccess {Number} data.records.recommendationIndex 推荐指数
   * @apiSuccess {String} data.records.viewCount 浏览量
   * @apiSuccess {String} data.records.categoryName 分类名称
   * @apiSuccess {Number} data.records.categoryDisplayName 分类显示名称
   * @apiSuccess {String} data.records.coverPic 封面图url
   */
  @Route('get', '/frontend-service/tags/:name/posts')
  async getPostByTagName () {
    const { ctx, service } = this;

    const dto = await ctx.validate<FrontendPageGetDto>(FrontendPageGetDto, this.getQuery());

    const { name } = this.getParams();

    const tag = await service.post.tag.findOne({
      name,
    });
    if (!tag) {
      this.res(undefined, 422);
      return;
    }

    const postIds = await service.post.tag.getPostIdsByTagId(tag.id, dto);

    const [posts, total] = await service.post.tag.getPostsByTagIds(tag.id, postIds.map(({ postId }) => postId));

    this.res({
      data: this.pageWrapper(
        posts.map(v => this.formatDateField(v as any)),
        dto.current,
        dto.pageSize,
        total
      )
    });
  }

  /**
   * @api {get} /frontend-service/posts/:id 获取文章详情
   * @apiGroup Frontend - Post
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
  @Route('get', '/frontend-service/posts/:id')
  async show () {
    const { id } = this.getParams();

    const post = await this.service.post.post.findOne({
      id,
      isShow: 1
    }, [
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

    const [prev, next] = await this.service.post.post.findPrevAndNext(id);
    // const {
    //   // eslint-disable-next-line @typescript-eslint/no-unused-vars
    //   operator, isShow, sort,
    //   ...otherPostFileds
    // } = post;

    this.res({
      data: {
        post: this.formatDateField(formatFrontendPostDetail(post)),
        prev,
        next
      },
    });
  }
}
