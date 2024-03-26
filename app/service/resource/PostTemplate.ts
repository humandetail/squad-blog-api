import { FindManyOptions } from 'typeorm';
import { isNull, isUndefined } from 'lodash';
import { CreatePostTemplateDto, UpdatePostTemplateDto } from '../../dto/resource/postTemplate';
import BaseService from '../BaseService';

export type IPostTemplate = CreatePostTemplateDto & {
  qiniuDomain: string;
  qiniuKey: string;
};

export default class PostTemplateService extends BaseService {
  async create ({ coverId, ...template }: IPostTemplate) {
    const PostTemplate = this.getRepo().resource.PostTemplate;

    const cover = await this.getRepo().resource.Picture.findOne({ where: { id: coverId } });

    if (!cover) {
      this.ctx.throw('图片不存在', 422);
    }

    const data = PostTemplate.create({
      ...template,
      cover,
      operator: this.ctx.token.username
    });

    await PostTemplate.save(data);
  }

  async update (id: number, { coverId, ...data }: Partial<UpdatePostTemplateDto>) {
    const template = await this.getRepo().resource.PostTemplate.findOne({ where: { id } });

    if (!template) {
      return false;
    }

    if (coverId) {
      const cover = await this.getRepo().resource.Picture.findOne({ where: { id: coverId } });

      if (!cover) {
        this.ctx.throw('图片不存在', 422);
      }
      template.cover = cover;
    }

    Object.entries(data).forEach(([key, value]) => {
      if (!isNull(value) && !isUndefined(value)) {
        template[key] = value;
      }
    });

    const result = await this.getRepo().resource.PostTemplate.save(template);

    return result;
  }

  async find (options: FindManyOptions) {
    return this.getRepo().resource.PostTemplate.findAndCount({
      ...options,
      relations: ['cover']
    } as any);
  }

  async findOne (where: any, relations: string[] = []) {
    return this.getRepo().resource.PostTemplate.findOne({ where, relations });
  }

  async delete (id: number) {
    const { affected } = await this.getRepo().resource.PostTemplate.delete(id);

    return !!affected;
  }
}
