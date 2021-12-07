import { unlink } from 'fs';
import { FindCondition, Like } from 'typeorm';
import { BaseToggleShowDto } from '../../../dto/common/common';
import { CreatePostTemplateDto, QueryPostTemplatesDto, UpdatePostTemplateDto } from '../../../dto/resource/postTemplate';
import PostTemplate from '../../../entities/mysql/resource/PostTemplate';
import { AdminRoute } from '../../../libs/decorators/RouterRegister';
import { formatPostTemplate } from '../../../libs/utils';
import { IPostTemplate } from '../../../service/resource/PostTemplate';
import BaseController from '../../BaseController';

export default class PostTemplateController extends BaseController {
  /**
   * @api {post} /templates 创建文章模板
   * @apiGroup Resource - PostTemplate
   * @apiParam {String} name 模板名称
   * @apiParam {Number} coverId 外键-封面图id
   * @apiParam {File} file 上传的文件
   * @apiUse BaseReq
   * @apiUse Auth
   * @apiUse BaseRes
   */
  @AdminRoute('post', '/templates')
  async create () {
    const { ctx, service } = this;

    const dto = await ctx.validate<CreatePostTemplateDto>(CreatePostTemplateDto);

    const exists = await service.resource.postTemplate.findOne({ name: dto.name });

    if (exists) {
      this.res({
        code: -1,
        message: '模板名称已存在'
      });
      return;
    }

    const file = ctx.request.files[0];

    if (!file) {
      this.res({
        code: 20001
      });
      return;
    }

    try {
      const { key } = await service.common.qiniu.upload(file, 'template') as any;

      const tempalte: IPostTemplate = {
        qiniuDomain: this.config.qiniu.ossDomain,
        qiniuKey: key as string,
        ...dto
      };

      await service.resource.postTemplate.create(tempalte);

      // 删除临时文件
      unlink(file.filepath, () => { /**/ });

      this.res();
    } catch (e) {
      this.res({
        code: 20002
      });
    }
  }

  /**
   * @api {put} /templates/:id/show 更改模板显示状态
   * @apiGroup Resource - PostTemplate
   * @apiParam {Number} isShow 1=显示；0=不显示
   * @apiUse Auth
   * @apiUse BaseRes
   */
  @AdminRoute('put', '/templates/:id/show')
  async edit () {
    const { ctx, service } = this;
    const { id } = this.getParams();
    const dto = await ctx.validate<BaseToggleShowDto>(BaseToggleShowDto);

    const result = await service.resource.postTemplate.update(id, dto);

    if (!result) {
      this.res({
        code: 30001,
      });
      return;
    }
    this.res();
  }

  /**
   * @api {put} /templates/:id 修改文章模板
   * @apiGroup Resource - PostTemplate
   * @apiParam {String} name 模板名称
   * @apiParam {Number} coverId 外键-封面图id
   * @apiUse BaseReq
   * @apiUse Auth
   * @apiUse BaseRes
   */
  @AdminRoute('put', '/templates/:id')
  async update () {
    const { ctx, service } = this;

    const dto = await ctx.validate<UpdatePostTemplateDto>(UpdatePostTemplateDto);

    const { id } = this.getParams();

    const result = await service.resource.postTemplate.update(id, dto);

    if (!result) {
      this.res({
        code: 30001
      });
      return;
    }
    this.res();
  }

  /**
   * @api {get} /templates 获取模板
   * @apiGroup Resource - PostTemplate
   * @apiUse PageReq
   * @apiUse Auth
   * @apiUse PageRes
   * @apiSuccess {Object} data
   * @apiSuccess {Object[]} data.records 查询数据列表
   * @apiSuccess {String} data.records.name 模板名称
   * @apiSuccess {String} data.records.qiniuDomain 七牛domain
   * @apiSuccess {String} data.records.qiniuKey 七牛文件名
   * @apiSuccess {number} data.records.coverId 外键-封面图id
   * @apiSuccess {number} data.records.coverPic 封面图url
   */
  @AdminRoute('get', '/templates')
  async index () {
    const { ctx, service } = this;

    const dto = await ctx.validate<QueryPostTemplatesDto>(QueryPostTemplatesDto, this.getQuery());

    const { keyword, ...otherOptions } = dto;

    const where: FindCondition<PostTemplate> = {};

    if (keyword) {
      where.name = Like(`%${keyword}%`);
    }

    const options = this.formatFindManyOptions(
      otherOptions,
      where,
    );

    const [templates, total] = await service.resource.postTemplate.find(options);

    this.res({
      data: this.pageWrapper(
        templates.map(v => formatPostTemplate(v)),
        dto.current,
        dto.pageSize,
        total
      )
    });
  }

  /**
   * @api {get} /templates/:id 获取模板详情
   * @apiGroup Resource - PostTemplate
   * @apiUse Auth
   * @apiUse InfoRes
   * @apiSuccess {Object} data
   * @apiSuccess {String} data.name 模板名称
   * @apiSuccess {String} data.qiniuDomain 七牛domain
   * @apiSuccess {String} data.qiniuKey 七牛文件名
   * @apiSuccess {number} data.coverId 外键-封面图id
   * @apiSuccess {number} data.coverPic 封面图 url
   */
  @AdminRoute('get', '/templates/:id')
  async show () {
    const { id } = this.getParams();

    const data = await this.service.resource.postTemplate.findOne({ id }, ['cover']);

    if (!data) {
      this.res({
        code: 30001
      });
      return;
    }

    this.res({
      data: formatPostTemplate(data)
    });
  }

  /**
   * @api {delete} /templates/:id 删除模板
   * @apiGroup Resource - PostTemplate
   * @apiUse Auth
   * @apiUse BaseRes
   */
  @AdminRoute('delete', '/templates/:id')
  async destroy () {
    const { id } = this.getParams();

    const PostTemplateService = this.service.resource.postTemplate;

    const template = await PostTemplateService.findOne({ id });

    if (!template) {
      this.res({
        code: 30001
      });
      return;
    }

    // 删除资源
    if (template.qiniuKey) {
      try {
        await this.service.common.qiniu.delete([template.qiniuKey]);
      } catch {
        this.res({
          code: 20004
        });
      }
    }

    await PostTemplateService.delete(id);

    this.res();
  }
}
