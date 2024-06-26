import * as _ from 'lodash';
import { FindManyOptions, In } from 'typeorm';
import { BatchWorkMountDto, BatchWorkShowDto, CreatePersonalWorkDto, UpdatePersonalWorkDto } from '../../dto/personal/work';
import BaseService from '../BaseService';

export default class PersonalWorkService extends BaseService {
  async findOne (where: any, relations: string[] = []) {
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

  async findAll () {
    return await this.getRepo().personal.PersonalWork.find({
      // select: ['id', 'name', 'description', 'link', 'pictures'],
      where: {
        isShow: 1
      },
      order: {
        sort: 'DESC',
        createdTime: 'DESC'
      },
      relations: ['pictures']
    });
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

    const base = await this.getRepo().personal.PersonalBase.findOne({ where: { id: baseId } });

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
      const base = await this.getRepo().personal.PersonalBase.findOne({ where: { id: baseId } });

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

    work.operator = this.ctx.token.username;

    await this.getRepo().personal.PersonalWork.save(work);

    return true;
  }

  async delete (id: number) {
    const personalWork = await this.getRepo().personal.PersonalWork.findOne({ where: { id } });

    if (!personalWork) {
      return false;
    }

    await this.getRepo().personal.PersonalWork.delete(id);

    return true;
  }

  async batchMount ({ baseId, newBaseId, isAll, ids = [] }: BatchWorkMountDto) {
    const where: any = {};

    if (baseId) {
      const base = await this.getRepo().personal.PersonalBase.findOne({ where: { id: baseId } });
      if (!base) {
        this.ctx.throw('原挂载点不存在', 422);
      }
      where.base = base;
    }

    if (!isAll) {
      where.id = In(ids);
    }

    const works = await this.getRepo().personal.PersonalWork.find({
      relations: ['base'],
      where
    });

    if (works.length === 0) {
      return false;
    }

    const newBase = await this.getRepo().personal.PersonalBase.findOne({ where: { id: newBaseId } });

    if (!newBase) {
      this.ctx.throw('新挂载点不存在', 422);
    }

    await this.getRepo().personal.PersonalWork.save(works.map(work => {
      work.base = newBase;
      return work;
    }));

    return true;
  }

  async batchShow ({ isShow, isAll, ids = [] }: BatchWorkShowDto) {
    const works = await this.getRepo().personal.PersonalWork.find({
      ...(!isAll ? { where: { id: In(ids) } } : null)
    });

    if (!works) {
      return false;
    }

    await this.getRepo().personal.PersonalWork.save(works.map(work => {
      work.isShow = isShow;
      return work;
    }));

    return true;
  }

  async batchDelete (ids: number[]) {
    const works = await this.getRepo().personal.PersonalWork.find({
      where: { id: In(ids) }
    });
    if (!works) {
      return false;
    }

    await this.getRepo().personal.PersonalWork.remove(works);

    return true;
  }
}
