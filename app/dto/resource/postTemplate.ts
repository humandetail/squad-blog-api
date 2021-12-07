import {
  Length,
  IsInt,
  IsOptional,
  IsString
} from 'class-validator';
import { Expose, Transform } from 'class-transformer';
import { BaseCreateDto, PageGetDto } from '../common/common';

export class CreatePostTemplateDto extends BaseCreateDto {
  @Length(2, 32, { message: '模板名称为2-32个字符' })
  @Expose()
  name: string;

  @IsInt({ message: '请使用正确的封面' })
  @Transform(v => v && parseInt(v), { toClassOnly: true })
  @Expose()
  coverId: number;
}

export class UpdatePostTemplateDto extends CreatePostTemplateDto {}

export class QueryPostTemplatesDto extends PageGetDto {
  @IsOptional()
  @IsString()
  @Expose()
  keyword?: string;
}
