import {
  Length,
  IsString,
  IsOptional
} from 'class-validator';
import { Expose } from 'class-transformer';
import { BaseCreateDto, PageGetDto } from '../common/common';

export class PostCategoryDto extends BaseCreateDto {
  @Length(2, 32, { message: '文章分类名称为2-32个字符' })
  @Expose()
  name: string;

  @Length(2, 64, { message: '文章分类显示名称为2-64个字符' })
  @Expose()
  displayName: string;
}

export class QueryPostCategoryDto extends PageGetDto {
  @IsOptional()
  @IsString()
  @Expose()
  keyword?: string;
}
