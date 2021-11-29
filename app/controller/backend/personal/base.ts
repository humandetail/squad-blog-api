import { isEmpty } from 'lodash';
import { Like } from 'typeorm';
import { CreatePersonalBaseDto, QueryPersonalBasesDto, UpdatePersonalBaseDto } from '../../../dto/personal/base';
import { AdminRoute } from '../../../libs/decorators/RouterRegister';
import BaseController from '../../BaseController';

export default class PersonalBaseController extends BaseController {
  @AdminRoute('post', '/personal/base')
  async create () {
    const { ctx } = this;
    const dto = await ctx.validate<CreatePersonalBaseDto>(CreatePersonalBaseDto);

    const result = await this.service.personal.base.create(dto);

    if (!result) {
      this.res({
        code: 422,
        message: '参数校验失败'
      });
    } else {
      this.res();
    }
  }

  @AdminRoute('put', '/personal/base/:id')
  async update () {
    const { id } = this.getParams();

    if (isEmpty(this.getBody())) {
      this.res({
        code: 400,
        message: '请求参数不能为空'
      });
      return;
    }

    const dto = await this.ctx.validate<UpdatePersonalBaseDto>(UpdatePersonalBaseDto);

    const result = await this.service.personal.base.update(id, dto);
    if (!result) {
      this.res({
        code: -1,
        message: '数据不存在'
      });
    } else {
      this.res();
    }
  }

  @AdminRoute('get', '/personal/base/:id')
  async getPersonalBase () {
    const { id } = this.getParams();

    const data = await this.service.personal.base.getPersonalBase(id);

    this.res({
      data
    });
  }

  @AdminRoute('get', '/personal/bases')
  async getPersonalBases () {
    const { ctx } = this;
    const dto = await ctx.validate<QueryPersonalBasesDto>(QueryPersonalBasesDto, this.getQuery());

    const { field, keyword, ...otherOptions } = dto;
    const options = this.formatFindManyOptions(
      otherOptions,
      field && keyword ? { [field]: Like(`${keyword}%`) } : null
    );

    const { personalBases, total } = await this.service.personal.base.getPersonalBases(options);

    this.res({
      data: this.pageWrapper(personalBases, dto.current, dto.pageSize, total)
    });
  }

  @AdminRoute('delete', '/personal/base/:id')
  async destroy () {
    const { id } = this.getParams();

    const result = await this.service.personal.base.delete(id);

    if (!result) {
      this.res({
        code: -1,
        message: '请求参数错误'
      });
      return;
    }
    this.res();
  }
}
