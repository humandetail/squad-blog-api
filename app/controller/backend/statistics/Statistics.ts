import { StatisticDto } from '../../../dto/common/statistic';
import { AdminRoute } from '../../../libs/decorators/RouterRegister';
import BaseController from '../../BaseController';

export default class StatisticsController extends BaseController {
  /**
   * @api {get} /statistics/todayFlow 获取今日流量
   * @apiGroup Resource - Statistics
   * @apiUse BaseReq
   * @apiUse Auth
   * @apiUse BaseRes
   */
  @AdminRoute('get', '/statistics/todayFlow')
  async getTodayFlow () {
    const todyFlow = await this.service.statistics.statistics.getTodayFlow();

    if (!todyFlow) {
      this.res({
        code: 30001
      });
      return;
    }

    this.res({
      data: todyFlow
    });
  }

  /**
   * @api {get} /statistics/pv 获取pv
   * @apiGroup Resource - Statistics
   * @apiUse BaseReq
   * @apiUse Auth
   * @apiUse BaseRes
   */
  @AdminRoute('get', '/statistics/pv')
  async getPV () {
    const { ctx, service } = this;
    const dto = await ctx.validate<StatisticDto>(StatisticDto, this.getQuery());
    const pv = await service.statistics.statistics.getPV(dto.range);

    if (!pv) {
      this.res({
        code: 30001
      });
      return;
    }

    this.res({
      data: pv
    });
  }

  /**
   * @api {get} /statistics/uv 获取uv
   * @apiGroup Resource - Statistics
   * @apiUse BaseReq
   * @apiUse Auth
   * @apiUse BaseRes
   */
  @AdminRoute('get', '/statistics/uv')
  async getUV () {
    const { ctx, service } = this;
    const dto = await ctx.validate<StatisticDto>(StatisticDto, this.getQuery());
    const uv = await service.statistics.statistics.getUV(dto.range);

    if (!uv) {
      this.res({
        code: 30001
      });
      return;
    }

    this.res({
      data: uv
    });
  }

  /**
   * @api {get} /statistics/top10Keywords 获取top10Keywords
   * @apiGroup Resource - Statistics
   * @apiUse BaseReq
   * @apiUse Auth
   * @apiUse BaseRes
   */
  @AdminRoute('get', '/statistics/top10Keywords')
  async getTop10Keywords () {
    const { ctx, service } = this;
    const dto = await ctx.validate<StatisticDto>(StatisticDto, this.getQuery());

    const keywords = await service.statistics.statistics.getTop10Keywords(dto.range);

    if (!keywords) {
      this.res({
        code: 30001
      });
      return;
    }

    this.res({
      data: keywords
    });
  }

  /**
   * @api {get} /statistics/top10PostViews 获取top10PostViews
   * @apiGroup Resource - Statistics
   * @apiUse BaseReq
   * @apiUse Auth
   * @apiUse BaseRes
   */
  @AdminRoute('get', '/statistics/top10PostViews')
  async getTop10PostViews () {
    const { ctx, service } = this;
    const dto = await ctx.validate<StatisticDto>(StatisticDto, this.getQuery());

    const postViews = await service.statistics.statistics.getTop10PostViews(dto.range);

    if (!postViews) {
      this.res({
        code: 30001
      });
      return;
    }

    this.res({
      data: postViews
    });
  }
}
