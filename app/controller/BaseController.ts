import { Controller } from 'egg';
import _ = require('lodash');
import { Equal } from 'typeorm';
import { PageGetDto } from '../dto/common/common';
import { IResCode } from '../extend/helper';
import { formatDateField } from '../libs/utils';

export interface IResponseOptions {
  data?: any;
  code?: IResCode;
  message?: string;
}

/**
 * @apiDefine BaseReq
 * @apiParam {Number} [isShow=0] 是否显示
 * @apiParam {Number} [sort=0] 排序
 */

/**
 * @apiDefine PageReq
 * @apiParam {Number} [isShow] 是否显示
 * @apiParam {Number} [current=1] 当前页码
 * @apiParam {Number} [pageSize=10] 每页数据量
 * @apiParam {String} [sortField] 排序字段
 * @apiParam {String} [sortDesc] 是否逆序排序
 */

/**
 * @apiDefine Auth
 * @apiHeader {String} Authorization Bearer Token
 */

/**
 * @apiDefine BaseRes
 * @apiSuccess {Number} code 返回码，成功则返回200
 * @apiSuccess {String} message 提示信息，成功则返回“操作成功”
 * @apiSuccess {Object} data -
 */

/**
 * @apiDefine InfoRes
 * @apiUse BaseRes
 * @apiSuccess {String} data.id 主键id
 * @apiSuccess {Number} data.sort 排序
 * @apiSuccess {Number} data.isShow 是否显示
 * @apiSuccess {String} data.operator 操作员
 * @apiSuccess {String} data.createdTime 创建时间
 * @apiSuccess {String} data.updatedTime 最后更新时间
 */

/**
* @apiDefine PageRes
* @apiUse BaseRes
* @apiSuccess {Object[]} data.records 查询数据列表
* @apiSuccess {String} data.records.id 主键id
* @apiSuccess {Number} data.records.sort 排序
* @apiSuccess {Number} data.records.isShow 是否显示
* @apiSuccess {String} data.records.operator 操作员
* @apiSuccess {String} data.records.createdTime 创建时间
* @apiSuccess {String} data.records.updatedTime 最后更新时间
* @apiSuccess {Number} data.current 当前页码
* @apiSuccess {Number} data.pageSize 每页数据量
* @apiSuccess {Number} data.total 总数量
*/

export default abstract class BaseController extends Controller {
  // 格式化日期字段
  protected formatDateField = formatDateField;

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
   * 格式化 sql 查询条件
   */
  protected formatFindManyOptions (query: PageGetDto, whereOpts: any = null) {
    const { current = 1, pageSize = 10, sortField, sortDesc, ...where } = query;

    const limit = !current || !pageSize
      ? undefined
      : { skip: (current - 1) * pageSize, take: pageSize };

    const order = !sortField || !sortDesc
      ? { order: { sort: 'DESC' as any, createdTime: 'DESC' as any } } // 默认排序为根据排序字段和创建时间逆序
      : { order: { [sortField]: (sortDesc ? 'DESC' : 'AST') as any } };

    let _where = Object.entries(where).reduce((prev, [key, value]) => {
      if (value) {
        prev[key] = Equal(value);
      }
      return prev;
    }, {});

    if (_.isArray(whereOpts)) {
      _where = whereOpts.map(item => {
        return {
          ...item,
          ..._where
        };
      });
    } else {
      _where = {
        ..._where,
        ...whereOpts
      };
    }

    return {
      where: _where,
      ...order,
      ...limit,
    };
  }

  /**
   * 分页数据组装
   * @param records - 分页数据
   * @param current - 当前页码
   * @param pageSize - 单页数据量
   * @param total - 总条目数
   * @returns
   */
  protected pageWrapper<T> (records: T[] = [], current = 1, pageSize = 10, total = 0) {
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
  protected res (options: IResponseOptions = {}, status = 200): void {
    const { ctx } = this;
    ctx.set('Content-Type', 'application/json');

    const code = options?.code ?? (status === 422 ? 422 : 200);
    ctx.status = status;
    ctx.body = {
      code,
      data: options?.data ?? null,
      message: options?.message || this.getHelper().getResMessage(code),
    };
  }
}
