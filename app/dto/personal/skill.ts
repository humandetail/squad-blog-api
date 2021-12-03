import {
  Length,
  IsString,
  IsOptional,
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
