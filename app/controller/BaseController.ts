import { Controller } from 'egg';

export interface IResponseOptions {
  data?: any;
  code?: number;
  message?: string;
}

export default abstract class BaseController extends Controller {
  /**
   * 获取查询参数
   */
  protected getQuery () {
    return this.ctx.request.query;
  }

  /**
   * 获取请求体
   */
  protected getBody () {
    return this.ctx.request.body;
  }

  /**
   * 获取请求参数
   */
  protected getParams () {
    return this.ctx.params;
  }

  /**
   * 获取 helper
   */
  protected getHelper () {
    return this.ctx.helper;
  }

  /**
   * 分页数据组装
   * @param records - 分页数据
   * @param current - 当前页码
   * @param pageSize - 单页数据量
   * @param total - 总条目数
   * @returns
   */
  protected pageWrapper<T> (records: T[] = [], current = 0, pageSize = 0, total = 0) {
    return {
      current,
      pageSize,
      records,
      total
    };
  }

  /**
   * 返回响应体
   */
  protected res (options: IResponseOptions): void {
    const { ctx } = this;
    ctx.set('Content-Type', 'application/json');
    ctx.body = {
      code: options?.code ?? 200,
      data: options?.data ?? null,
      message: options?.message ?? 'success'
    };
  }
}
