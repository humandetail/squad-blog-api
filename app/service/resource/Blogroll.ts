import * as _ from 'lodash';
import { FindManyOptions } from 'typeorm';
import { CreateBlogrollDto, UpdateBlogrollDto } from '../../dto/resource/blogroll';
import Blogroll from '../../entities/mysql/resource/Blogroll';
import BaseService, { IWhereCondition } from '../BaseService';

type IUpdateBlogrollInfo = Partial<UpdateBlogrollDto>;

export default class BlogrollService extends BaseService {
  async create (data: CreateBlogrollDto) {
    const Blogroll = this.getRepo().resource.Blogroll;

    const blogroll = Blogroll.create(data);

    blogroll.operator = this.ctx.token.username;

    await Blogroll.save(blogroll);

    return true;
  }

  async update (id: number, data: IUpdateBlogrollInfo) {
    const blogroll = await this.findOne({ id });

    if (!blogroll) {
      return false;
    }

    Object.entries(data).forEach(([key, value]) => {
      if (!_.isNull(value) && !_.isUndefined(value)) {
        blogroll[key] = value;
      }
    });

    blogroll.operator = this.ctx.token.username;

    await this.getRepo().resource.Blogroll.save(blogroll);

    return true;
  }

  async findOne (where: IWhereCondition<Blogroll>) {
    return this.getRepo().resource.Blogroll.findOne({
      where
    });
  }

  async find (options: FindManyOptions) {
    return await this.getRepo().resource.Blogroll.findAndCount(options);
  }

  async delete (id: number) {
    const blogroll = await this.getRepo().resource.Blogroll.findOne(id);

    if (!blogroll) {
      return false;
    }

    await this.getRepo().resource.Blogroll.delete(id);

    return true;
  }
}
