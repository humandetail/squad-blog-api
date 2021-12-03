import {
  Length,
  IsOptional,
  IsString,
  IsInt
} from 'class-validator';
import { Expose, Transform } from 'class-transformer';
import { BaseCreateDto, BaseUpdateDto, PageGetDto } from '../../common/common';

export class CreatePictureDto extends BaseCreateDto {
  @Length(2, 32, { message: '图片名称不能为空' })
  @Expose()
  name: string;

  @IsInt({ message: '图片分类不能为空' })
  @Transform(v => v && parseInt(v), { toClassOnly: true })
  @Expose()
  categoryId: number;
}

export class UpdatePictureDto extends BaseUpdateDto {
  @IsOptional()
  @Length(2, 32, { message: '图片名称不能为空' })
  @Expose()
  name?: string;

  @IsOptional()
  @IsInt({ message: '图片分类不能为空' })
  @Transform(v => v && parseInt(v), { toClassOnly: true })
  @Expose()
  categoryId?: number;
}

export class QueryPictureDto extends PageGetDto {
  @IsOptional()
  @IsInt({ message: '图片分类不能为空' })
  @Transform(v => v && parseInt(v), { toClassOnly: true })
  @Expose()
  categoryId?: number;

  @IsOptional()
  @IsString()
  @Expose()
  keyword?: string;
}
