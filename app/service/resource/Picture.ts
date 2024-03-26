import { FindManyOptions } from 'typeorm';
import { UpdatePictureDto } from '../../dto/resource/picture/picture';
import BaseService from '../BaseService';
import Picture from '../../entities/mysql/resource/Picture';

// interface IPicture extends CreatePictureDto {
//   qiniuDomain: string;
//   qiniuKey: string;
// }
export default class PictureService extends BaseService {
  async create (pic: Picture) {
    const Picture = this.getRepo().resource.Picture;

    const data = Picture.create({
      ...pic,
      operator: this.ctx.token.username
    });

    return await Picture.save(data);
  }

  async update (id: number, data: UpdatePictureDto & { qiniuKey: string; }) {
    const picture = await this.getRepo().resource.Picture.findOne({ where: { id }, relations: ['category'] });

    if (!picture) {
      return false;
    }

    if (data.categoryId) {
      const category = await this.getRepo().resource.PictureCategory.findOne({ where: { id: data.categoryId } });

      if (!category) {
        return false;
      }

      picture.category = category;
    }

    picture.qiniuKey = data.qiniuKey;
    picture.operator = this.ctx.token.username;
    picture.isShow = data.isShow ?? picture.isShow;
    picture.name = data.name || picture.name;
    picture.sort = data.sort || picture.sort;

    const result = await this.getRepo().resource.Picture.save(picture);

    return result;
  }

  async editIsShow (id: number, isShow: number) {
    const picture = await this.getRepo().resource.Picture.findOne({ where: { id } });
    if (!picture) {
      return false;
    }
    picture.isShow = isShow;

    const result = await this.getRepo().resource.Picture.save(picture);

    return result;
  }

  async findOne (where: any, relations?: string[]) {
    return this.getRepo().resource.Picture.findOne({ where, relations });
  }

  async getPictures (options: FindManyOptions) {
    return this.getRepo().resource.Picture.findAndCount(options);
  }

  async delete (id: number) {
    return this.getRepo().resource.Picture.delete(id);
  }
}
