import { UpdateSettingDto } from '../../../dto/sys/setting';
import { AdminRoute } from '../../../libs/decorators/RouterRegister';
import { formatSetting } from '../../../libs/utils';
import BaseController from '../../BaseController';

export default class SettingController extends BaseController {
  /**
   * @api {get} /setting 获取网站设置
   * @apiGroup System - Setting
   * @apiUse Auth
   * @apiUse InfoRes
   * @apiSuccess {Object} data
   * @apiSuccess {String} data.siteName 技能名称
   * @apiSuccess {String} data.seoTitle seo title
   * @apiSuccess {String} data.seoKeywords seo keywords
   * @apiSuccess {String} data.seoDescription seo description
   * @apiSuccess {String} data.status 运行状态
   * @apiSuccess {Number} data.logoId 外键-logo id
   * @apiSuccess {String} data.logoPic logo url
   */
  @AdminRoute('get', '/setting')
  async show () {
    const setting = await this.service.sys.setting.findOne(true);

    if (!setting) {
      this.res({
        code: 30001
      });
      return;
    }

    this.res({
      data: formatSetting(setting)
    });
  }

  /**
   * @api {put} /setting 修改网站设置
   * @apiGroup System - Setting
   * @apiParam {String} siteName 技能名称
   * @apiParam {String} seoTitle seo title
   * @apiParam {String} seoKeywords seo keywords
   * @apiParam {String} seoDescription seo description
   * @apiParam {String} status 运行状态
   * @apiParam {Number} logoId 外键-logo id
   * @apiUse BaseReq
   * @apiUse Auth
   * @apiUse BaseRes
   */
  @AdminRoute('put', '/setting')
  async update () {
    const { ctx, service } = this;

    const dto = await ctx.validate<UpdateSettingDto>(UpdateSettingDto);

    await service.sys.setting.update(dto);

    this.res();
  }
}
