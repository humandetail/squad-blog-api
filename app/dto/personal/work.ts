import {
  Length,
  IsString,
  IsOptional,
  IsArray,
  IsInt,
  IsBoolean,
  Min,
  Max,
  ArrayMinSize
} from 'class-validator';
import { Expose, Transform } from 'class-transformer';
import { BaseCreateDto, PageGetDto } from '../common/common';

export class CreatePersonalWorkDto extends BaseCreateDto {
  @Length(2, 32, { message: '名称长度为2-32个字符' })
  @IsString({ message: '名称长度为2-32个字符' })
  @Expose()
  name: string;

  @Length(1, 500, { message: '链接长度不能超过500个字符' })
  @IsString({ message: '链接长度不能超过500个字符' })
  @Expose()
  link: string;

  @Length(0, 255, { message: '技能说明不能超过255个字符' })
  @IsString({ message: '技能说明不能超过255个字符' })
  @Expose()
  description: string;

  @IsArray({ message: '请使用正确的图片' })
  @IsInt({
    each: true,
    message: '请使用正确的图片'
  })
  @Transform(v => v && v.map(val => parseInt(val)), { toClassOnly: true })
  @Expose()
  pictures: number[];

  @IsInt({ message: '请使用正确的挂载点' })
  @Transform(v => v && parseInt(v), { toClassOnly: true })
  @Expose()
  baseId: number;
}

export class UpdatePersonalWorkDto extends CreatePersonalWorkDto {}

export class QueryPersonalWorksDto extends PageGetDto {
  @IsOptional()
  @IsString()
  @Expose()
  keyword?: string;
}


class WorkBatchDto {
  @IsOptional()
  @IsBoolean()
  @Expose()
  isAll?: boolean;

  @IsOptional()
  @IsArray({ message: 'id集合必须是个 Array<string> 类型' })
  @ArrayMinSize(1, { message: 'id集合不能为空' })
  @IsInt({
    each: true,
    message: 'id集合必须是个 Array<string> 类型'
  })
  @Expose()
  ids?: number[];
}

export class BatchWorkMountDto extends WorkBatchDto {
  @IsInt({ message: '挂载点必须是个数值类型' })
  @Transform(v => v && parseInt(v), { toClassOnly: true })
  @Expose()
  baseId: number;

  @IsInt({ message: '新挂载点必须是个数值类型' })
  @Transform(v => v && parseInt(v), { toClassOnly: true })
  @Expose()
  newBaseId: number;
}

export class BatchWorkShowDto extends WorkBatchDto {
  @IsInt({ message: '是否显示字段必须是0或者1' })
  @Min(0, { message: '是否显示字段必须是0或者1' })
  @Max(1, { message: '是否显示字段必须是0或者1' })
  @Transform(v => v && parseInt(v), { toClassOnly: true })
  @Expose()
  isShow: number;
}

export class BatchWorkDeleteDto {
  @IsArray({ message: 'id集合必须是个 Array<number> 类型' })
  @ArrayMinSize(1, { message: 'id集合不能为空' })
  @IsInt({
    each: true,
    message: 'id集合必须是个 Array<number> 类型'
  })
  @Expose()
  ids: number[];
}
