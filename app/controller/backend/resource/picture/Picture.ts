import { unlink } from 'fs';
import { FindCondition, Like } from 'typeorm';
import { CreatePictureDto, QueryPictureDto, UpdatePictureDto } from '../../../../dto/resource/picture/picture';
import Picture from '../../../../entities/mysql/resource/Picture';
import { AdminRoute } from '../../../../libs/decorators/RouterRegister';
import BaseController from '../../../BaseController';

export default class PictureController extends BaseController {
  /**
   * @api {post} /pictures 创建图片
   * @apiGroup Resource - Picture
   * @apiParam {String} name 图片名称
   * @apiParam {Number} categoryId 外键-分类id
   * @apiParam {File} file 上传的文件
   * @apiUse BaseReq
   * @apiUse Auth
   * @apiUse BaseRes
   */
  @AdminRoute('post', '/pictures')
  async create () {
    const { ctx, service } = this;

    const dto = await ctx.validate<CreatePictureDto>(CreatePictureDto);

    const file = ctx.request.files[0];

    if (!file) {
      this.res({
        code: 20001
      });
      return;
    }

    const category = await service.resource.pictureCategory.findOne({ id: dto.categoryId });

    if (!category || category.isShow !== 1) {
      this.res({
        code: 422,
        message: '图片分类不存在'
      }, 422);
      return;
    }

    try {
      const { key } = await service.common.qiniu.upload(file, category.name) as any;

      const picture: any = {
        qiniuDomain: this.config.qiniu.ossDomain,
        qiniuKey: key as string,
        ...dto
      };
      picture.category = category;

      await service.resource.picture.create(picture);

      // 删除临时文件
      unlink(file.filepath, () => { /**/ });

      this.res();
    } catch (e) {
      this.res({
        code: 20002
      });
    }
  }

  /**
   * @api {put} /pictures/:id 修改图片信息
   * @apiGroup Resource - Picture
   * @apiParam {String} name 图片名称
   * @apiParam {Number} categoryId 外键-分类id
   * @apiUse BaseReq
   * @apiUse Auth
   * @apiUse BaseRes
   */
  @AdminRoute('put', '/pictures/:id')
  async update () {
    const { ctx, service } = this;

    const dto = await ctx.validate<UpdatePictureDto>(UpdatePictureDto);

    const { id } = this.getParams();

    const picture = await service.resource.picture.findOne({ id }, ['category']);

    if (!picture) {
      this.res({
        code: 30001
      });
      return;
    }

    // 旧的资源名称
    const oldName = picture.qiniuKey;
    // 新的资源名称
    let newName = oldName;

    // 涉及分类的更改 需要同步修改 qiniu 里面的数据
    if (dto.categoryId && (!picture.category || picture.category.id !== dto.categoryId)) {
      const category = await service.resource.pictureCategory.findOne({ id: dto.categoryId });
      if (!category) {
        ctx.status = 422;
        this.res({
          code: 422,
          message: '图片分类不存在'
        });
        return;
      }

      newName = category.name + '/' + oldName.split('/')[1];

      const result = await service.common.qiniu.rename(oldName, newName);

      if (!result) {
        this.res({
          code: 20003
        });
        return;
      }
    }

    const result = await service.resource.picture.update(id, {
      ...dto,
      qiniuKey: newName
    });

    if (!result) {
      try {
        await service.common.qiniu.rename(newName, oldName);
      } catch {
        //
      }
      this.res({
        code: 30003
      });
    }
    this.res();
  }

  /**
   * @api {get} /pictures 获取图片列表
   * @apiGroup Resource - Picture
   * @apiUse PageReq
   * @apiUse Auth
   * @apiUse PageRes
   * @apiSuccess {Object} data
   * @apiSuccess {Object[]} data.records 查询数据列表
   * @apiSuccess {String} data.records.name 图片名称
   * @apiSuccess {String} data.records.qiniuDomain 七牛domain
   * @apiSuccess {String} data.records.qiniuKey 七牛文件名
   * @apiSuccess {number} data.records.categoryId 外键-分类id
   */
  @AdminRoute('get', '/pictures')
  async index () {
    const { ctx, service } = this;

    const dto = await ctx.validate<QueryPictureDto>(QueryPictureDto, this.getQuery());

    const { keyword, categoryId, ...otherOptions } = dto;

    const where: FindCondition<Picture> = {};

    if (keyword) {
      where.name = Like(`%${keyword}%`);
    }
    if (categoryId) {
      const category = await service.resource.pictureCategory.findOne({ id: categoryId });
      if (!category) {
        this.res({
          code: 422
        });
        return;
      }
      where.category = category;
    }

    const options = this.formatFindManyOptions(
      otherOptions,
      where,
    );

    const [pictures, total] = await service.resource.picture.getPictures({
      ...options,
      relations: ['category']
    });

    this.res({
      data: this.pageWrapper(
        pictures.map(v => this.formateCategory(v)).map(v => this.formateDateField(v)),
        dto.current,
        dto.pageSize,
        total
      )
    });
  }

  /**
   * @api {get} /pictures/:id 获取图片详情
   * @apiGroup Resource - Picture
   * @apiUse Auth
   * @apiUse InfoRes
   * @apiSuccess {Object} data
   * @apiSuccess {String} data.name 图片名称
   * @apiSuccess {String} data.qiniuDomain 七牛domain
   * @apiSuccess {String} data.qiniuKey 七牛文件名
   * @apiSuccess {number} data.categoryId 外键-分类id
   */
  @AdminRoute('get', '/pictures/:id')
  async show () {
    const { id } = this.getParams();

    const data = await this.service.resource.picture.findOne({ id }, ['category']);

    if (!data) {
      this.res({
        code: 30001
      });
      return;
    }

    this.res({
      data: this.formateDateField(this.formateCategory(data))
    });
  }

  /**
   * @api {delete} /pictures/:id 删除图片
   * @apiGroup Resource - Picture
   * @apiUse Auth
   * @apiUse BaseRes
   */
  @AdminRoute('delete', '/pictures/:id')
  async destroy () {
    const { id } = this.getParams();

    const PictureService = this.service.resource.picture;

    const picture = await PictureService.findOne({ id });

    if (!picture) {
      this.res({
        code: 30001
      });
      return;
    }

    // 删除资源
    if (picture.qiniuKey) {
      try {
        await this.service.common.qiniu.delete([picture.qiniuKey]);
      } catch {
        this.res({
          code: 20004
        });
      }
    }

    await PictureService.delete(id);

    this.res();
  }

  private formateCategory (pic: Picture) {
    const { category, ...picture } = pic;

    const categoryId = category?.id || null;

    return {
      ...picture,
      categoryId
    };
  }
}
