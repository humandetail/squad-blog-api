import { FindManyOptions } from 'typeorm';
import { PictureCategoryDto } from '../../dto/resource/picture/category';
import PictureCategory from '../../entities/mysql/resource/PictureCategory';
import BaseService, { IWhereCondition } from '../BaseService';

export default class PictureCategoryService extends BaseService {
  async create (category: PictureCategoryDto) {
    return await this.getRepo().resource.PictureCategory.insert({
      ...category,
      operator: this.ctx.token.username
    });
  }

  async update (id: number, category: PictureCategoryDto | { isShow: number }) {
    const PictureCategory = this.getRepo().resource.PictureCategory;
    const data = await PictureCategory.findOne(id);
    if (!data) {
      return false;
    }

    Object.entries(category).forEach(([key, value]) => {
      if (value !== undefined) {
        data[key] = value;
      }
    });
    await PictureCategory.save(data);
    return true;
  }

  async getPictureCategoies (options: FindManyOptions) {
    return this.getRepo().resource.PictureCategory.findAndCount(options);
  }

  async findOne (where: IWhereCondition<PictureCategory>) {
    return this.getRepo().resource.PictureCategory.findOne({ where });
  }

  async delete (id: number) {
    const { affected } = await this.getRepo().resource.PictureCategory.delete(id);

    return !!affected;
  }
}
