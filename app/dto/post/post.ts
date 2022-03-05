import * as _ from 'lodash';
import {
  Length,
  ArrayMaxSize,
  ArrayMinSize,
  MaxLength,
  IsOptional,
  IsString,
  IsInt,
  IsBoolean,
  IsArray,
  Min,
  Max,
  IsEnum
} from 'class-validator';
import { Expose, Transform } from 'class-transformer';
import { BaseCreateDto, PageGetDto } from '../common/common';

export enum EBatchTagAction {
  'add' = 'add',
  'change' = 'change',
  'remove' = 'remove'
}

export class CreatePostDto extends BaseCreateDto {
  @Length(2, 255, { message: '标题为2-255个字符' })
  @Expose()
  title: string;

  @Length(2, 500, { message: '摘要为2-500个字符' })
  @Expose()
  summary: string;

  @Length(1, 65535, { message: '内容不能为空，且不能超过65535个字符' })
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
  @MaxLength(255, { message: 'seo标题不能超过255个字符' })
  @Expose()
  seoTitle: string;

  @IsOptional()
  @MaxLength(255, { message: 'seo关键字不能超过255个字符' })
  @Expose()
  seoKeywords: string;

  @IsOptional()
  @MaxLength(500, { message: 'seo说明不能超过500个字符' })
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

class PostBatchDto {
  @IsOptional()
  @IsBoolean()
  @Expose()
  isAll?: boolean;

  @IsOptional()
  @IsArray({ message: 'id集合必须是个 Array<string> 类型' })
  @ArrayMinSize(1, { message: 'id集合不能为空' })
  @IsString({
    each: true,
    message: 'id集合必须是个 Array<string> 类型'
  })
  @Expose()
  ids?: string[];
}
export class BatchPostCategoryDto extends PostBatchDto {
  @IsInt({ message: '分类必须是个数值类型' })
  @Transform(v => v && parseInt(v), { toClassOnly: true })
  @Expose()
  categoryId: number;

  @IsInt({ message: '新分类必须是个数值类型' })
  @Transform(v => v && parseInt(v), { toClassOnly: true })
  @Expose()
  newCategoryId: number;
}

export class BatchPostTagDto extends PostBatchDto {
  @IsOptional()
  @IsInt({ message: '标签必须是个数值类型' })
  @Transform(v => v && parseInt(v), { toClassOnly: true })
  @Expose()
  tagId?: number;

  @IsInt({ message: '新标签必须是个数值类型' })
  @Transform(v => v && parseInt(v), { toClassOnly: true })
  @Expose()
  newTagId: number;

  @IsEnum(EBatchTagAction, { message: '操作只能是 add|change|remove 中的一种' })
  @Transform(v => v.toString().toLowerCase(), { toClassOnly: true })
  @Expose()
  action: EBatchTagAction;
}

export class BatchPostTemplateDto extends PostBatchDto {
  @IsInt({ message: '模板必须是个数值类型' })
  @Transform(v => v && parseInt(v), { toClassOnly: true })
  @Expose()
  templateId: number;

  @IsInt({ message: '新模板必须是个数值类型' })
  @Transform(v => v && parseInt(v), { toClassOnly: true })
  @Expose()
  newTemplateId: number;
}

export class BatchPostShowDto extends PostBatchDto {
  @IsInt({ message: '是否显示字段必须是0或者1' })
  @Min(0, { message: '是否显示字段必须是0或者1' })
  @Max(1, { message: '是否显示字段必须是0或者1' })
  @Transform(v => v && parseInt(v), { toClassOnly: true })
  @Expose()
  isShow: number;
}

export class BatchPostDeleteDto {
  @IsArray({ message: 'id集合必须是个 Array<string> 类型' })
  @ArrayMinSize(1, { message: 'id集合不能为空' })
  @IsString({
    each: true,
    message: 'id集合必须是个 Array<string> 类型'
  })
  @Expose()
  ids: string[];
}
