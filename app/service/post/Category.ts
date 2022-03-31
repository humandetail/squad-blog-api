import { FindManyOptions } from 'typeorm';
import { isNull, isUndefined } from 'lodash';
import { PostCategoryDto } from '../../dto/post/category';
import Category from '../../entities/mysql/post/Category';
import BaseService, { IWhereCondition } from '../BaseService';

export default class PostCategoryService extends BaseService {
  async create (category: PostCategoryDto) {
    return await this.getRepo().post.Category.insert({
      ...category,
      operator: this.ctx.token.username
    });
  }

  async update (id: number, category: Partial<PostCategoryDto>) {
    const PostCategory = this.getRepo().post.Category;
    const data = await PostCategory.findOne(id);
    if (!data) {
      return false;
    }

    Object.entries(category).forEach(([key, value]) => {
      if (!isUndefined(value) && !isNull(value)) {
        data[key] = value;
      }
    });
    await PostCategory.save(data);
    return true;
  }

  async getPictureCategoies (options: FindManyOptions) {
    return this.getRepo().post.Category.findAndCount(options);
  }

  async findOne (where: IWhereCondition<Category>) {
    return this.getRepo().post.Category.findOne({ where });
  }

  async findAll () {
    return this.getRepo().post.Category.findAndCount({
      select: ['id', 'name', 'displayName', 'createdTime', 'updatedTime'],
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
    const { affected } = await this.getRepo().post.Category.delete(id);

    return !!affected;
  }
}
