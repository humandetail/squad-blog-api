import * as _ from 'lodash';
import { FindConditions, FindManyOptions, In } from 'typeorm';
import { BatchSkillMountDto, BatchSkillShowDto, CreatePersonalSkillDto, UpdatePersonalSkillDto } from '../../dto/personal/skill';
import PersonalSkill from '../../entities/mysql/personal/PersonalSkill';
import BaseService, { IWhereCondition } from '../BaseService';

type IUpdatePersonalSkillInfo = Partial<UpdatePersonalSkillDto>;

export default class PersonalSkillService extends BaseService {
  async create ({ iconId, baseId, ...other }: CreatePersonalSkillDto) {
    const PersonalSkill = this.getRepo().personal.PersonalSkill;

    const personalBase = await this.service.personal.base.findOne({ id: baseId }, []);

    if (!personalBase) {
      this.ctx.throw('挂载点不存在', 422);
    }

    const icon = await this.service.resource.picture.findOne({ id: iconId }, []);

    if (!icon) {
      this.ctx.throw('图标不存在', 422);
    }

    const skill = PersonalSkill.create(other);

    skill.operator = this.ctx.token.username;
    skill.base = personalBase;
    skill.icon = icon;

    await PersonalSkill.save(skill);

    return true;
  }

  async update (id: number, { iconId, baseId, ...data }: IUpdatePersonalSkillInfo) {
    const skill = await this.findOne({ id });

    if (!skill) {
      return false;
    }

    if (iconId) {
      const icon = await this.service.resource.picture.findOne({ id: iconId }, []);
      if (!icon) {
        this.ctx.throw('不存在的图标', 422);
      }
      skill.icon = icon;
    }

    if (baseId) {
      const base = await this.service.personal.base.findOne({ id: baseId }, []);
      if (!base) {
        this.ctx.throw('不存在的挂载点', 422);
      }
      skill.base = base;
    }

    Object.entries(data).forEach(([key, value]) => {
      if (!_.isNull(value) && !_.isUndefined(value)) {
        skill[key] = value;
      }
    });

    skill.operator = this.ctx.token.username;

    await this.getRepo().personal.PersonalSkill.save(skill);

    return true;
  }

  async findOne (where: IWhereCondition<PersonalSkill>, relations: string[] = ['base', 'icon']) {
    return this.getRepo().personal.PersonalSkill.findOne({
      where,
      relations
    });
  }

  async find (options: FindManyOptions) {
    return await this.getRepo().personal.PersonalSkill.findAndCount({
      ...options,
      relations: ['icon', 'base']
    } as any);
  }

  async delete (id: number) {
    const personalSkill = await this.getRepo().personal.PersonalSkill.findOne(id);

    if (!personalSkill) {
      return false;
    }

    await this.getRepo().personal.PersonalSkill.delete(id);

    return true;
  }

  async batchMount ({ baseId, newBaseId, isAll, ids = [] }: BatchSkillMountDto) {
    const where: FindConditions<PersonalSkill> = {};

    if (baseId) {
      const base = await this.getRepo().personal.PersonalBase.findOne({ id: baseId });
      if (!base) {
        this.ctx.throw('原挂载点不存在', 422);
      }
      where.base = base;
    }

    if (!isAll) {
      where.id = In(ids);
    }

    const skills = await this.getRepo().personal.PersonalSkill.find({
      relations: ['base'],
      where
    });

    if (skills.length === 0) {
      return false;
    }

    const newBase = await this.getRepo().personal.PersonalBase.findOne({ id: newBaseId });

    if (!newBase) {
      this.ctx.throw('新挂载点不存在', 422);
    }

    await this.getRepo().personal.PersonalSkill.save(skills.map(skill => {
      skill.base = newBase;
      return skill;
    }));

    return true;
  }

  async batchShow ({ isShow, isAll, ids = [] }: BatchSkillShowDto) {
    const skills = await this.getRepo().personal.PersonalSkill.find({
      ...(!isAll ? { where: { id: In(ids) } } : null)
    });

    if (!skills) {
      return false;
    }

    await this.getRepo().personal.PersonalSkill.save(skills.map(skill => {
      skill.isShow = isShow;
      return skill;
    }));

    return true;
  }

  async batchDelete (ids: number[]) {
    const skills = await this.getRepo().personal.PersonalSkill.find({
      where: { id: In(ids) }
    });
    if (!skills) {
      return false;
    }

    await this.getRepo().personal.PersonalSkill.remove(skills);

    return true;
  }
}
