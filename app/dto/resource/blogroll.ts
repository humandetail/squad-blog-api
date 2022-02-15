import {
  Length,
  IsString,
  IsOptional
} from 'class-validator';
import { Expose } from 'class-transformer';
import { BaseCreateDto, PageGetDto } from '../common/common';

export class CreateBlogrollDto extends BaseCreateDto {
  @Length(2, 32, { message: '友链名称长度为2-32个字符' })
  @IsString({ message: '友链名称长度为2-32个字符' })
  @Expose()
  name: string;

  @Length(1, 128, { message: '链接长度不能超过128个字符' })
  @IsString({ message: '链接长度不能超过128个字符' })
  @Expose()
  link: string;

  @Length(0, 255, { message: '备注不能超过255个字符' })
  @IsString()
  @Expose()
  remarks: string;
}

export class UpdateBlogrollDto extends CreateBlogrollDto {}

export class QueryBlogrollsDto extends PageGetDto {
  @IsOptional()
  @IsString()
  @Expose()
  keyword?: string;
}
