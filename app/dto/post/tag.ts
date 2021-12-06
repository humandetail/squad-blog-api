import {
  Length,
  IsString,
  IsOptional
} from 'class-validator';
import { Expose } from 'class-transformer';
import { BaseCreateDto, PageGetDto } from '../common/common';

export class PostTagDto extends BaseCreateDto {
  @Length(2, 32, { message: '文章标签名称为2-32个字符' })
  @Expose()
  name: string;

  @Length(2, 64, { message: '文章标签显示名称为2-64个字符' })
  @Expose()
  displayName: string;
}

export class QueryPostTagDto extends PageGetDto {
  @IsOptional()
  @IsString()
  @Expose()
  keyword?: string;
}
