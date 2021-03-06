import { isNull, isUndefined } from 'lodash';
import { UpdateSettingDto } from '../../dto/sys/setting';
import BaseService from '../BaseService';

export default class SettingService extends BaseService {
  async create () {
    const setting = this.getRepo().sys.Setting.create({
      siteName: '',
      seoTitle: '',
      seoKeywords: '',
      seoDescription: '',
      status: 0,
      operator: '',
      sort: 0,
      isShow: 1
    });
    return this.getRepo().sys.Setting.save(setting);
  }

  async findOne (withLogo = false) {
    return this.getRepo().sys.Setting.findOne(withLogo ? {
      relations: ['logo']
    } : {});
  }

  async update ({ logoId, ...data }: UpdateSettingDto) {
    const setting = await this.findOne();

    if (!setting) {
      this.ctx.throw('配置信息不存在', 422);
    }

    if (logoId) {
      const logo = await this.getRepo().resource.Picture.findOne(logoId);

      if (!logo) {
        this.ctx.throw('不存在的图片资源', 422);
      }

      setting.logo = logo;
    }

    Object.entries(data).forEach(([key, value]) => {
      if (!isNull(value) && !isUndefined(value)) {
        setting[key] = value;
      }
    });

    setting.operator = this.ctx.token.username;

    await this.getRepo().sys.Setting.save(setting);

    return true;
  }
}
