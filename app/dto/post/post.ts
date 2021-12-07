import * as _ from 'lodash';
import {
  Length,
  ArrayMaxSize,
  ArrayMinSize,
  MaxLength,
  IsOptional,
  IsString,
  IsInt,
  IsArray
} from 'class-validator';
import { Expose, Transform } from 'class-transformer';
import { BaseCreateDto, PageGetDto } from '../common/common';

export class CreatePostDto extends BaseCreateDto {
  @Length(2, 255, { message: '标题为2-255个字符' })
  @Expose()
  title: string;

  @Length(2, 500, { message: '摘要为2-500个字符' })
  @Expose()
  summary: string;

  @Length(1, 65535, { message: '内容不能为空，且不能超时65535个字符' })
  @Expose()
  content: string;

  @Length(1, 50, { message: '作者为1-50个字符' })
  @Expose()
  author: string;

  @Length(1, 255, { message: '来源为1-255个字符' })
  @Expose()
  source: string;

  @IsInt({ message: '推荐指数必须是个数值类型' })
  @Transform(v => v && parseInt(v), { toClassOnly: true })
  @Expose()
  recommendationIndex: number;

  @IsInt({ message: '分类必须是个数值类型' })
  @Transform(v => v && parseInt(v), { toClassOnly: true })
  @Expose()
  categoryId: number;

  @IsInt({ message: '封面图必须是个数值类型' })
  @Transform(v => v && parseInt(v), { toClassOnly: true })
  @Expose()
  coverId: number;

  @IsArray({ message: '标签必须是个 Array<number> 类型' })
  @ArrayMinSize(1, { message: '至少要有一个标签' })
  @ArrayMaxSize(5, { message: '标签不能超过5个' })
  @IsInt({
    each: true,
    message: '标签必须是个 Array<number> 类型'
  })
  @Transform(v => _.isArray(v) && v.map(val => parseInt(val)), { toClassOnly: true })
  @Expose()
  tags: number[];

  @IsOptional()
  @MaxLength(255, { message: 'seo标题不能操作255个字符' })
  @Expose()
  seoTitle: string;

  @IsOptional()
  @MaxLength(255, { message: 'seo关键字不能操作255个字符' })
  @Expose()
  seoKeywords: string;

  @IsOptional()
  @MaxLength(500, { message: 'seo说明不能操作500个字符' })
  @Expose()
  seoDescription: string;

  @IsOptional()
  @IsInt({ message: '模板必须是个数值类型' })
  @Transform(v => v && parseInt(v), { toClassOnly: true })
  @Expose()
  templateId: number;
}

export class UpdatePostDto extends CreatePostDto {}

export class QueryPostsDto extends PageGetDto {
  @IsOptional()
  @IsInt({ message: '分类必须是个数值类型' })
  @Transform(v => v && parseInt(v), { toClassOnly: true })
  @Expose()
  categoryId?: number;

  @IsOptional()
  @IsString()
  @Expose()
  keyword?: string;
}
