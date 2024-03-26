import { isNull, isUndefined } from 'lodash';
import { UpdateSettingDto } from '../../dto/sys/setting';
import BaseService from '../BaseService';
import { Not } from 'typeorm';

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
    const data = await this.getRepo().sys.Setting.find(withLogo ? {
      relations: ['logo'],
      where: { id: Not(0) }
    } : { where: { id: Not(0) } });

    return data[0];
  }

  async update ({ logoId, ...data }: UpdateSettingDto) {
    const setting = await this.findOne();

    if (!setting) {
      this.ctx.throw('配置信息不存在', 422);
    }

    if (logoId) {
      const logo = await this.getRepo().resource.Picture.findOne({ where: { id: logoId } });

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
