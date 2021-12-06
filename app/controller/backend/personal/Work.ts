import { Like } from 'typeorm';
import { BaseToggleShowDto } from '../../../dto/common/common';
import { CreatePersonalWorkDto, QueryPersonalWorksDto, UpdatePersonalWorkDto } from '../../../dto/personal/work';
import { AdminRoute } from '../../../libs/decorators/RouterRegister';
import { formatPersonalWork } from '../../../libs/utils';
import BaseController from '../../BaseController';

export default class PersonalWorkController extends BaseController {
  /**
   * @api {post} /personal/works 创建个人作品集
   * @apiGroup Personal - Work
   * @apiParam {String} name 作品名称
   * @apiParam {String} link 作品链接
   * @apiParam {String} description 作品描述
   * @apiParam {Number} pictures 图片id集合
   * @apiParam {Number} baseId 外键-挂载点id
   * @apiUse BaseReq
   * @apiUse Auth
   * @apiUse BaseRes
   */
  @AdminRoute('post', '/personal/works')
  async create () {
    const { ctx, service } = this;

    const dto = await ctx.validate<CreatePersonalWorkDto>(CreatePersonalWorkDto);

    // 校验名称唯一性
    const work = await service.personal.work.findOne({ name: dto.name });

    if (work) {
      ctx.status = 422;
      this.res({
        code: 422,
        message: '作品名称已存在'
      });
      return;
    }

    await service.personal.work.create(dto);

    this.res();
  }

  /**
   * @api {put} /personal/works/:id 修改个人作品
   * @apiGroup Personal - Work
   * @apiParam {String} name 作品名称
   * @apiParam {String} link 作品链接
   * @apiParam {String} description 作品描述
   * @apiParam {Number} pictures 图片id集合
   * @apiParam {Number} baseId 外键-挂载点id
   * @apiUse BaseReq
   * @apiUse Auth
   * @apiUse BaseRes
   */
  @AdminRoute('put', '/personal/works/:id')
  async update () {
    const { ctx, service } = this;

    const { id } = this.getParams();

    const dto = await ctx.validate<UpdatePersonalWorkDto>(UpdatePersonalWorkDto);

    const result = await service.personal.work.update(id, dto);

    if (!result) {
      this.res({
        code: 30001
      });
      return;
    }
    this.res();
  }

  /**
   * @api {put} /personal/works/:id/show 更改个人作品显示状态
   * @apiGroup Personal - Work
   * @apiParam {Number} isShow 是否显示
   * @apiUse Auth
   * @apiUse BaseRes
   */
  @AdminRoute('put', '/personal/works/:id/show')
  async edit () {
    const { id } = this.getParams();

    const dto = await this.ctx.validate<BaseToggleShowDto>(BaseToggleShowDto);

    const result = await this.service.personal.work.update(id, dto);
    if (!result) {
      this.res({
        code: 30001
      });
    } else {
      this.res();
    }
  }

  /**
   * @api {get} /personal/works/:id 获取个人作品详情
   * @apiGroup Personal - Work
   * @apiUse Auth
   * @apiUse InfoRes
   * @apiSuccess {Object} data
   * @apiSuccess {String} data.name 技能名称
   * @apiSuccess {String} data.link
   * @apiSuccess {String} data.description 技能描述
   * @apiSuccess {Number} data.baseId 外键-挂载点id
   * @apiSuccess {String} data.baseNickname 挂载点昵称
   * @apiSuccess {Object[]} data.pictures 图片集合
   * @apiSuccess {Number} data.pictures.id 图片id
   * @apiSuccess {String} data.pictures.url 图片url
   */
  @AdminRoute('get', '/personal/works/:id')
  async show () {
    const { id } = this.getParams();

    const personalWork = await this.service.personal.work.findOne({ id }, ['base', 'pictures']);

    if (!personalWork) {
      this.res({ code: 30001 });
      return;
    }

    this.res({
      data: formatPersonalWork(personalWork)
    });
  }

  /**
   * @api {get} /personal/bases 获取个人技能列表
   * @apiGroup Personal - Base
   * @apiUse Auth
   * @apiUse InfoRes
   * @apiSuccess {Object} data
   * @apiSuccess {Object[]} data.records
   * @apiSuccess {String} data.records.name 技能名称
   * @apiSuccess {String} data.records.link 技能链接
   * @apiSuccess {String} data.records.description 技能描述
   * @apiSuccess {Number} data.records.baseId 外键-挂载点id
   * @apiSuccess {String} data.records.baseNickname 挂载点昵称
   * @apiSuccess {Object[]} data.records.pictures 图片集合
   * @apiSuccess {Number} data.records.pictures.id 图片id
   * @apiSuccess {String} data.records.pictures.url 图片url
   */
  @AdminRoute('get', '/personal/works')
  async index () {
    const { ctx } = this;
    const dto = await ctx.validate<QueryPersonalWorksDto>(QueryPersonalWorksDto, this.getQuery());

    const { keyword, ...otherOptions } = dto;
    const options = this.formatFindManyOptions(
      otherOptions,
      keyword ? { name: Like(`%${keyword}%`) } : null
    );

    const [ personalWorks, total ] = await this.service.personal.work.find(options);

    this.res({
      data: this.pageWrapper(
        personalWorks.map(v => formatPersonalWork(v)),
        dto.current, dto.pageSize,
        total
      )
    });
  }

  /**
   * @api {delete} /personal/works/:id 删除个人技能
   * @apiGroup Personal - Work
   * @apiUse Auth
   * @apiUse BaseRes
   */
  @AdminRoute('delete', '/personal/works/:id')
  async destroy () {
    const { id } = this.getParams();

    const result = await this.service.personal.work.delete(id);

    if (!result) {
      this.res({
        code: 30001
      });
      return;
    }
    this.res();
  }
}
