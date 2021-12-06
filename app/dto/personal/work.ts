import {
  Length,
  IsString,
  IsOptional,
  IsArray,
  IsInt
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
