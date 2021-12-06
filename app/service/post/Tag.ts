import { FindManyOptions } from 'typeorm';
import { isNull, isUndefined } from 'lodash';
import { PostTagDto } from '../../dto/post/tag';
import Tag from '../../entities/mysql/post/Tag';
import BaseService, { IWhereCondition } from '../BaseService';

export default class PostTagService extends BaseService {
  async create (tag: PostTagDto) {
    return await this.getRepo().post.Tag.insert({
      ...tag,
      operator: this.ctx.token.username
    });
  }

  async update (id: number, tag: Partial<PostTagDto>) {
    const PostTag = this.getRepo().post.Tag;
    const data = await PostTag.findOne(id);
    if (!data) {
      return false;
    }

    Object.entries(tag).forEach(([key, value]) => {
      if (!isUndefined(value) && !isNull(value)) {
        data[key] = value;
      }
    });
    await PostTag.save(data);
    return true;
  }

  async getPictureCategoies (options: FindManyOptions) {
    return this.getRepo().post.Tag.findAndCount(options);
  }

  async findOne (where: IWhereCondition<Tag>) {
    return this.getRepo().post.Tag.findOne({ where });
  }

  async delete (id: number) {
    const { affected } = await this.getRepo().post.Tag.delete(id);

    return !!affected;
  }
}
