import { Like } from 'typeorm';
import { BaseToggleShowDto } from '../../../dto/common/common';
import { CreatePersonalSkillDto, QueryPersonalSkillsDto, UpdatePersonalSkillDto } from '../../../dto/personal/skill';
import { AdminRoute } from '../../../libs/decorators/RouterRegister';
import { formatPersonalSkill } from '../../../libs/utils';
import BaseController from '../../BaseController';

export default class PersonalSkillController extends BaseController {
  /**
   * @api {post} /personal/skills 创建个人技能信息
   * @apiGroup Personal - Skill
   * @apiParam {String} name 技能名称
   * @apiParam {String} description 技能描述
   * @apiParam {Number} iconId 外键-图标id
   * @apiParam {Number} baseId 外键-挂载点id
   * @apiUse BaseReq
   * @apiUse Auth
   * @apiUse BaseRes
   */
  @AdminRoute('post', '/personal/skills')
  async create () {
    const { ctx, service } = this;

    const dto = await ctx.validate<CreatePersonalSkillDto>(CreatePersonalSkillDto);

    // 校验名称唯一性
    const skill = await service.personal.skill.findOne({ name: dto.name });

    if (skill) {
      ctx.status = 422;
      this.res({
        code: 422,
        message: '技能名称已存在'
      });
      return;
    }

    await service.personal.skill.create(dto);

    this.res();
  }

  /**
   * @api {put} /personal/skills/:id 修改个人技能
   * @apiGroup Personal - Skill
   * @apiParam {String} name 技能名称
   * @apiParam {String} description 技能描述
   * @apiParam {Number} iconId 外键-图标id
   * @apiParam {Number} baseId 外键-挂载点id
   * @apiUse BaseReq
   * @apiUse Auth
   * @apiUse BaseRes
   */
  @AdminRoute('put', '/personal/skills/:id')
  async update () {
    const { ctx, service } = this;

    const { id } = this.getParams();

    const dto = await ctx.validate<UpdatePersonalSkillDto>(UpdatePersonalSkillDto);

    const result = await service.personal.skill.update(id, dto);

    if (!result) {
      this.res({
        code: 30001
      });
      return;
    }
    this.res();
  }

  /**
   * @api {put} /personal/skills/:id/show 更改个人技能显示状态
   * @apiGroup Personal - Skill
   * @apiParam {Number} isShow 是否显示
   * @apiUse Auth
   * @apiUse BaseRes
   */
  @AdminRoute('put', '/personal/skills/:id/show')
  async edit () {
    const { id } = this.getParams();

    const dto = await this.ctx.validate<BaseToggleShowDto>(BaseToggleShowDto);

    const result = await this.service.personal.skill.update(id, dto);
    if (!result) {
      this.res({
        code: 30001
      });
    } else {
      this.res();
    }
  }

  /**
   * @api {get} /personal/skills/:id 获取个人技能详情
   * @apiGroup Personal - Skill
   * @apiUse Auth
   * @apiUse InfoRes
   * @apiSuccess {Object} data
   * @apiSuccess {String} data.name 技能名称
   * @apiSuccess {String} data.description 技能描述
   * @apiSuccess {Number} data.iconId 外键-图片id
   * @apiSuccess {String} data.iconPic 图片url
   * @apiSuccess {Number} data.baseId 外键-挂载点id
   * @apiSuccess {String} data.baseNickname 挂载点昵称
   */
  @AdminRoute('get', '/personal/skills/:id')
  async show () {
    const { id } = this.getParams();

    const personalSkill = await this.service.personal.skill.findOne({ id });

    if (!personalSkill) {
      this.res({ code: 30001 });
      return;
    }

    this.res({
      data: formatPersonalSkill(personalSkill)
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
   * @apiSuccess {String} data.records.description 技能描述
   * @apiSuccess {Number} data.records.iconId 外键-图片id
   * @apiSuccess {String} data.records.iconPic 图片url
   * @apiSuccess {Number} data.records.baseId 外键-挂载点id
   * @apiSuccess {String} data.records.baseNickname 挂载点昵称
   */
  @AdminRoute('get', '/personal/skills')
  async index () {
    const { ctx } = this;
    const dto = await ctx.validate<QueryPersonalSkillsDto>(QueryPersonalSkillsDto, this.getQuery());

    const { keyword, ...otherOptions } = dto;
    const options = this.formatFindManyOptions(
      otherOptions,
      keyword ? { name: Like(`%${keyword}%`) } : null
    );

    const [ personalSkills, total ] = await this.service.personal.skill.find(options);

    this.res({
      data: this.pageWrapper(
        personalSkills.map(v => formatPersonalSkill(v)),
        dto.current, dto.pageSize,
        total
      )
    });
  }

  /**
   * @api {delete} /personal/skills/:id 删除个人技能
   * @apiGroup Personal - Skill
   * @apiUse Auth
   * @apiUse BaseRes
   */
  @AdminRoute('delete', '/personal/skills/:id')
  async destroy () {
    const { id } = this.getParams();

    const result = await this.service.personal.skill.delete(id);

    if (!result) {
      this.res({
        code: 30001
      });
      return;
    }
    this.res();
  }
}
