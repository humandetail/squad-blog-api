import * as _ from 'lodash';
import { FindManyOptions } from 'typeorm';
import { CreateBlogrollDto, UpdateBlogrollDto } from '../../dto/resource/blogroll';
import BaseService from '../BaseService';

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

  async findOne (where: any) {
    return this.getRepo().resource.Blogroll.findOne({
      where
    });
  }

  async find (options: FindManyOptions) {
    return await this.getRepo().resource.Blogroll.findAndCount(options);
  }

  async findAll () {
    return await this.getRepo().resource.Blogroll.findAndCount({
      select: ['id', 'link', 'name', 'remarks', 'createdTime', 'updatedTime'],
      where: {
        isShow: 1
      },
      order: {
        sort: 'DESC',
        createdTime: 'DESC'
      }
    });
  }

  async delete (id: number) {
    const blogroll = await this.getRepo().resource.Blogroll.findOne({ where: { id } });

    if (!blogroll) {
      return false;
    }

    await this.getRepo().resource.Blogroll.delete(id);

    return true;
  }
}
