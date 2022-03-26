import {
  Length,
  IsString,
  IsOptional,
  IsBoolean,
  IsArray,
  ArrayMinSize,
  Min,
  Max,
  IsInt
} from 'class-validator';
import { Expose, Transform } from 'class-transformer';
import { BaseCreateDto, PageGetDto } from '../common/common';

export class CreatePersonalSkillDto extends BaseCreateDto {
  @Length(2, 32, { message: '昵称长度为2-32个字符' })
  @IsString()
  @Expose()
  name: string;

  @Length(0, 255, { message: '技能说明不能超过255个字符' })
  @IsString()
  @Expose()
  description: string;

  @IsInt({ message: '请使用正确的图标' })
  @Transform(v => v && parseInt(v), { toClassOnly: true })
  @Expose()
  iconId: number;

  @IsInt({ message: '请使用正确的挂载点' })
  @Transform(v => v && parseInt(v), { toClassOnly: true })
  @Expose()
  baseId: number;
}

export class UpdatePersonalSkillDto extends CreatePersonalSkillDto {}

export class QueryPersonalSkillsDto extends PageGetDto {
  @IsOptional()
  @IsString()
  @Expose()
  keyword?: string;
}

class SkillBatchDto {
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

export class BatchSkillMountDto extends SkillBatchDto {
  @IsInt({ message: '挂载点必须是个数值类型' })
  @Transform(v => v && parseInt(v), { toClassOnly: true })
  @Expose()
  baseId: number;

  @IsInt({ message: '新挂载点必须是个数值类型' })
  @Transform(v => v && parseInt(v), { toClassOnly: true })
  @Expose()
  newBaseId: number;
}

export class BatchSkillShowDto extends SkillBatchDto {
  @IsInt({ message: '是否显示字段必须是0或者1' })
  @Min(0, { message: '是否显示字段必须是0或者1' })
  @Max(1, { message: '是否显示字段必须是0或者1' })
  @Transform(v => v && parseInt(v), { toClassOnly: true })
  @Expose()
  isShow: number;
}

export class BatchSkillDeleteDto {
  @IsArray({ message: 'id集合必须是个 Array<number> 类型' })
  @ArrayMinSize(1, { message: 'id集合不能为空' })
  @IsInt({
    each: true,
    message: 'id集合必须是个 Array<number> 类型'
  })
  @Expose()
  ids: number[];
}
