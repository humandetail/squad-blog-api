import {
  IsOptional,
  Length,
  IsNumberString,
  IsUrl,
  IsEmail,
  MaxLength,
  IsString,
  IsInt,
  Min,
  Max,
  IsIn
} from 'class-validator';
import { Expose, Transform } from 'class-transformer';
import { PageGetDto } from '../common/common';
export class CreatePersonalBaseDto {
  @Length(2, 32, { message: '昵称长度为2-32个字符' })
  @IsString()
  @Expose()
  nickname: string;

  @IsOptional()
  @Length(5, 11, { message: 'qq长度为5-11个字符' })
  @IsNumberString(undefined, { message: 'qq只能为数字' })
  @Expose()
  qq?: string;

  @IsOptional()
  @IsUrl(undefined, { message: '请输入正确的url地址' })
  @MaxLength(128, { message: 'url地址不能超过128个字符' })
  @Expose()
  blog?: string;

  @IsOptional()
  @IsUrl(undefined, { message: '请输入正确的url地址' })
  @MaxLength(128, { message: 'url地址不能超过128个字符' })
  @Expose()
  github?: string;

  @IsOptional()
  @IsEmail(undefined, { message: '请输入正确的email地址' })
  @MaxLength(128, { message: 'email地址不能超过128个字符' })
  @Expose()
  email?: string;

  @IsOptional()
  @IsString()
  @Expose()
  intro?: string;

  @IsOptional()
  @IsInt({ message: '请使用正确的头像' })
  @Transform(v => v && parseInt(v), { toClassOnly: true })
  @Expose()
  avatarId?: number;

  @IsOptional()
  @IsNumberString(undefined, { message: '排序值必须是数值类型' })
  @Expose()
  sort?: number;

  @IsOptional()
  @IsInt({ message: '是否显示字段必须是0或者1' })
  @Min(0, { message: '是否显示字段必须是0或者1' })
  @Max(1, { message: '是否显示字段必须是0或者1' })
  @Transform(v => v && parseInt(v), { toClassOnly: true })
  @Expose()
  isShow: number;

  @IsOptional()
  @IsInt({ message: '是否为默认字段必须是0或者1' })
  @Min(0, { message: '是否为默认字段必须是0或者1' })
  @Max(1, { message: '是否为默认字段必须是0或者1' })
  @Transform(v => v && parseInt(v), { toClassOnly: true })
  @Expose()
  isDefault: number;

  @IsOptional()
  @IsInt({ message: '是否显示技能字段必须是0或者1' })
  @Min(0, { message: '是否显示技能字段必须是0或者1' })
  @Max(1, { message: '是否显示技能字段必须是0或者1' })
  @Transform(v => v && parseInt(v), { toClassOnly: true })
  @Expose()
  isShowSkills: number;

  @IsOptional()
  @IsInt({ message: '是否显示作品集字段必须是0或者1' })
  @Min(0, { message: '是否显示作品集字段必须是0或者1' })
  @Max(1, { message: '是否显示作品集字段必须是0或者1' })
  @Transform(v => v && parseInt(v), { toClassOnly: true })
  @Expose()
  isShowWorks: number;
}

export class UpdatePersonalBaseDto extends CreatePersonalBaseDto {
  @IsOptional()
  @Length(2, 32, { message: '昵称长度为2-32个字符' })
  @IsString()
  @Expose()
  nickname: string;
}

export class EditPersonalBaseDto {
  @IsInt({ message: '是否为默认字段必须是0或者1' })
  @Min(0, { message: '是否为默认字段必须是0或者1' })
  @Max(1, { message: '是否为默认字段必须是0或者1' })
  @Transform(v => v && parseInt(v), { toClassOnly: true })
  @Expose()
  isDefault: number;
}

export class QueryPersonalBasesDto extends PageGetDto {
  @IsOptional()
  @IsIn(['nickname', 'qq', 'blog', 'email', 'github', 'operator'])
  @Transform(v => v && v.toLowerCase(), { toClassOnly: true })
  @Expose()
  field?: string;

  @IsOptional()
  @IsString()
  @Expose()
  keyword?: string;
}
