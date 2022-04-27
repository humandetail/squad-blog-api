import {
  Length,
  IsString,
  IsInt,
  Min,
  Max
} from 'class-validator';
import { Expose, Transform } from 'class-transformer';
import { BaseUpdateDto } from '../common/common';

export class UpdateSettingDto extends BaseUpdateDto {
  @Length(1, 32, { message: '网站名称不过超过32个字符' })
  @IsString({ message: '网站名称不过超过32个字符' })
  @Expose()
  siteName: string;

  @Length(1, 255, { message: 'seo title 不过超过255个字符' })
  @IsString({ message: 'seo title 不过超过255个字符' })
  @Expose()
  seoTitle: string;

  @Length(1, 255, { message: 'seo keywords 不过超过255个字符' })
  @IsString({ message: 'seo keywords 不过超过255个字符' })
  @Expose()
  seoKeywords: string;

  @Length(1, 500, { message: 'seo description 不过超过255个字符' })
  @IsString({ message: 'seo description 不过超过255个字符' })
  @Expose()
  seoDescription: string;

  @IsInt({ message: '状态必须是个数字：0=正常状态，1=升级维护，2=网站已关闭, 3=置灰状态' })
  @Min(0, { message: '状态必须是个数字：0=正常状态，1=升级维护，2=网站已关闭, 3=置灰状态' })
  @Max(3, { message: '状态必须是个数字：0=正常状态，1=升级维护，2=网站已关闭, 3=置灰状态' })
  @Transform(v => v && parseInt(v), { toClassOnly: true })
  @Expose()
  status: number;

  @IsInt({ message: '请使用正确的Logo' })
  @Transform(v => v && parseInt(v), { toClassOnly: true })
  @Expose()
  logoId: number;
}
