import {
  IsNumberString,
  IsOptional,
  IsIn,
  IsInt,
  Min,
  Max,
  IsString,
  IsBoolean
} from 'class-validator';
import { Expose, Transform } from 'class-transformer';

// 更新
export class BaseUpdateDto {
  @IsOptional()
  @IsIn([0, 1, '0', '1'], { message: '是否显示字段必须是0或者1' })
  @Expose()
  isShow?: number;

  @IsOptional()
  @IsNumberString(undefined, { message: '排序值必须是数值类型' })
  @Expose()
  sort?: number;
}

// 分页查询
export class PageGetDto {
  @IsOptional()
  @IsInt({ message: '是否显示字段必须是0或者1' })
  @Min(0, { message: '是否显示字段必须是0或者1' })
  @Max(1, { message: '是否显示字段必须是0或者1' })
  @Transform(v => v && parseInt(v), { toClassOnly: true })
  @Expose()
  isShow?: number;

  @IsOptional()
  @IsInt({ message: '当前页码必须是一个正整数' })
  @Min(0, { message: '当前页码必须是一个正整数' })
  @Transform(v => v && parseInt(v), { toClassOnly: true })
  @Expose()
  current?: number;

  @IsOptional()
  @IsInt({ message: '单页数量必须是一个正整数' })
  @Min(0, { message: '单页数量必须是一个正整数' })
  @Transform(v => v && parseInt(v), { toClassOnly: true })
  @Expose()
  pageSize?: number;

  @IsOptional()
  @IsString()
  @Expose()
  sortField?: string;

  @IsOptional()
  @IsBoolean({ message: '是否降序字段必须是个布尔值' })
  @Transform(v => v && v === 'true', { toClassOnly: true })
  @Expose()
  sortDesc?: boolean;
}
