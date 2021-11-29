import BaseService from '../BaseService';

export default class PictureService extends BaseService {
  async findOne (id: number) {
    const pic = await this.getRepo().resource.Picture.findOne(id);

    // TODO: 需要获取图片分类信息

    if (!pic) {
      throw new Error('图片资源不存在');
    }

    return this.formateDateField(pic);
  }
}
