import * as _ from 'lodash';
import { FindManyOptions, In } from 'typeorm';
import { CreatePersonalWorkDto, UpdatePersonalWorkDto } from '../../dto/personal/work';
import PersonalWork from '../../entities/mysql/personal/PersonalWork';
import BaseService, { IWhereCondition } from '../BaseService';

export default class PersonalWorkService extends BaseService {
  async findOne (where: IWhereCondition<PersonalWork>, relations: string[] = []) {
    return this.getRepo().personal.PersonalWork.findOne({
      where,
      relations
    });
  }

  async find (options: FindManyOptions) {
    return await this.getRepo().personal.PersonalWork.findAndCount({
      ...options,
      relations: ['pictures', 'base']
    } as any);
  }

  async create ({
    name,
    link,
    description,
    pictures,
    baseId,
    isShow,
    sort
  }: CreatePersonalWorkDto) {
    const PersonalWork = this.getRepo().personal.PersonalWork;

    const pics = await this.getRepo().resource.Picture.find({
      where: {
        id: In(pictures)
      }
    });

    if (pics.length === 0) {
      this.ctx.throw('不存在的图片资源', 422);
    }

    const base = await this.getRepo().personal.PersonalBase.findOne(baseId);

    if (!base) {
      this.ctx.throw('不存在的挂载点');
    }

    const work = PersonalWork.create({
      name,
      link,
      description,
      isShow,
      sort,
      base,
      pictures: pics,
      operator: this.ctx.token.username
    });

    await PersonalWork.save(work);

    return true;
  }

  async update (id: number, { baseId, pictures, ...otherFields }: Partial<UpdatePersonalWorkDto>) {
    const work = await this.findOne({ id }, ['base', 'pictures']);

    if (!work) {
      return false;
    }

    if (pictures) {
      const oldPics = work.pictures.map(v => v.id);

      if (!_.isEqual(oldPics, pictures)) {
        const pics = await this.getRepo().resource.Picture.find({
          where: { id: In(pictures) }
        });

        if (pics.length === 0) {
          this.ctx.throw('不存在的图片资源', 422);
        }

        work.pictures = pics;
      }
    }

    if (baseId) {
      const base = await this.getRepo().personal.PersonalBase.findOne(baseId);

      if (!base) {
        this.ctx.throw('不存在的挂载点', 422);
      }

      work.base = base;
    }

    Object.entries(otherFields).forEach(([key, value]) => {
      if (!_.isNull(value) && !_.isUndefined(value)) {
        work[key] = value;
      }
    });

    await this.getRepo().personal.PersonalWork.save(work);

    return true;
  }

  async delete (id: number) {
    const personalWork = await this.getRepo().personal.PersonalWork.findOne(id);

    if (!personalWork) {
      return false;
    }

    await this.getRepo().personal.PersonalWork.delete(id);

    return true;
  }
}