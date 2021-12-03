import { isEmpty } from 'lodash';
import { Like } from 'typeorm';
import { CreatePersonalBaseDto, EditPersonalBaseDto, QueryPersonalBasesDto, UpdatePersonalBaseDto } from '../../../dto/personal/base';
import { AdminRoute } from '../../../libs/decorators/RouterRegister';
import { formatPersonalBase } from '../../../libs/utils';
import BaseController from '../../BaseController';

export default class PersonalBaseController extends BaseController {
  /**
   * @api {post} /personal/bases 创建个人基本信息
   * @apiGroup Personal - Base
   * @apiParam {String} nickname 昵称
   * @apiParam {String} [qq] qq
   * @apiParam {String} [blog] blog
   * @apiParam {String} [github] github
   * @apiParam {String} [email] email
   * @apiParam {String} [intro] 简介
   * @apiParam {Number} [isDefault] 是否为默认信息
   * @apiParam {Number} [isShowSkills] 是否展示个人技能
   * @apiParam {Number} [isShowWorks] 是否展示作品集
   * @apiParam {Number} [avatarId] 外键-头像id
   * @apiUse BaseReq
   * @apiUse Auth
   * @apiUse BaseRes
   */
  @AdminRoute('post', '/personal/bases')
  async create () {
    const { ctx } = this;
    const dto = await ctx.validate<CreatePersonalBaseDto>(CreatePersonalBaseDto);

    await this.service.personal.base.create(dto);

    this.res();
  }

  /**
   * @api {put} /personal/bases/:id 修改个人基本信息
   * @apiGroup Personal - Base
   * @apiParam {String} [nickname] 昵称
   * @apiParam {String} [qq] qq
   * @apiParam {String} [blog] blog
   * @apiParam {String} [github] github
   * @apiParam {String} [email] email
   * @apiParam {String} [intro] 简介
   * @apiParam {Number} [isDefault] 是否为默认信息
   * @apiParam {Number} [isShowSkills] 是否展示个人技能
   * @apiParam {Number} [isShowWorks] 是否展示作品集
   * @apiParam {Number} [avatarId] 外键-头像id
   * @apiUse BaseReq
   * @apiUse Auth
   * @apiUse BaseRes
   */
  @AdminRoute('put', '/personal/bases/:id')
  async update () {
    const { id } = this.getParams();

    if (isEmpty(this.getBody())) {
      this.ctx.status = 422;
      this.res({
        code: 422,
        message: '请求参数不能为空'
      });
      return;
    }

    const dto = await this.ctx.validate<UpdatePersonalBaseDto>(UpdatePersonalBaseDto);

    const result = await this.service.personal.base.update(id, dto);
    if (!result) {
      this.res({
        code: 30001
      });
    } else {
      this.res();
    }
  }

  /**
   * @api {put} /personal/bases/:id/default 更改默认个人基本信息
   * @apiGroup Personal - Base
   * @apiParam {Number} isDefault 是否为默认信息
   * @apiUse Auth
   * @apiUse BaseRes
   */
  @AdminRoute('put', '/personal/bases/:id/default')
  async edit () {
    const { id } = this.getParams();

    const dto = await this.ctx.validate<EditPersonalBaseDto>(EditPersonalBaseDto);

    const result = await this.service.personal.base.update(id, dto);
    if (!result) {
      this.res({
        code: 30001
      });
    } else {
      this.res();
    }
  }

  /**
   * @api {get} /personal/bases/:id 获取个人基本信息详情
   * @apiGroup Personal - Base
   * @apiUse Auth
   * @apiUse InfoRes
   * @apiSuccess {Object} data
   * @apiParam {String} data.nickname 昵称
   * @apiParam {String} data.qq qq
   * @apiParam {String} data.blog blog
   * @apiParam {String} data.github github
   * @apiParam {String} data.email email
   * @apiParam {String} data.intro 简介
   * @apiParam {Number} data.isDefault 是否为默认信息
   * @apiParam {Number} data.isShowSkills 是否展示个人技能
   * @apiParam {Number} data.isShowWorks 是否展示作品集
   * @apiParam {Number} data.avatarId 外键-头像id
   * @apiParam {String} data.avatarPic 头像url
   * @apiParam {String} data.userId 外键-用户id
   * @apiParam {String} data.username 所属用户名
   */
  @AdminRoute('get', '/personal/bases/:id')
  async show () {
    const { id } = this.getParams();

    const personalBase = await this.service.personal.base.findOne({ id });

    if (!personalBase) {
      this.res({ code: 30001 });
      return;
    }

    this.res({
      data: formatPersonalBase(personalBase)
    });
  }


  /**
   * @api {get} /personal/bases 获取个人基本信息列表
   * @apiGroup Personal - Base
   * @apiUse Auth
   * @apiUse InfoRes
   * @apiSuccess {Object} data
   * @apiSuccess {Object[]} data.records
   * @apiParam {String} data.records.nickname 昵称
   * @apiParam {String} data.records.qq qq
   * @apiParam {String} data.records.blog blog
   * @apiParam {String} data.records.github github
   * @apiParam {String} data.records.email email
   * @apiParam {String} data.records.intro 简介
   * @apiParam {Number} data.records.isDefault 是否为默认信息
   * @apiParam {Number} data.records.isShowSkills 是否展示个人技能
   * @apiParam {Number} data.records.isShowWorks 是否展示作品集
   * @apiParam {Number} data.records.avatarId 外键-头像id
   * @apiParam {String} data.records.avatarPic 头像url
   * @apiParam {String} data.records.userId 外键-用户id
   * @apiParam {String} data.records.username 所属用户名
   */
  @AdminRoute('get', '/personal/bases')
  async index () {
    const { ctx } = this;
    const dto = await ctx.validate<QueryPersonalBasesDto>(QueryPersonalBasesDto, this.getQuery());

    const { field, keyword, ...otherOptions } = dto;
    const options = this.formatFindManyOptions(
      otherOptions,
      field && keyword ? { [field]: Like(`%${keyword}%`) } : null
    );

    const [ personalBases, total ] = await this.service.personal.base.getPersonalBases(options);

    this.res({
      data: this.pageWrapper(
        personalBases.map(v => formatPersonalBase(v)),
        dto.current, dto.pageSize,
        total
      )
    });
  }

  /**
   * @api {delete} /users/:id 删除个人基本信息
   * @apiGroup System - User
   * @apiUse Auth
   * @apiUse BaseRes
   */
  @AdminRoute('delete', '/personal/bases/:id')
  async destroy () {
    const { id } = this.getParams();

    const result = await this.service.personal.base.delete(id);

    if (!result) {
      this.res({
        code: 30001
      });
      return;
    }
    this.res();
  }
}
