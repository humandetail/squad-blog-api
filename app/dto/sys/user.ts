import {
  Matches,
  IsOptional,
  IsInt,
  Min,
  Max,
  IsString
} from 'class-validator';
import { Expose, Transform } from 'class-transformer';
import { BaseUpdateDto, PageGetDto } from '../common/common';
import { usernameReg, passwordReg } from '../../libs/regexp';
export class CreateUserDto {
  @Matches(usernameReg, { message: '用户名只能由字母或数字组成，长度为4-20' })
  @Expose()
  username: string;

  @Matches(passwordReg, { message: '密码必须包含英文字母、数字和特殊符号（!@#$%^&*_），长度为6-20' })
  @Expose()
  password: string;
}

export class ChangePasswordDto {
  @Matches(passwordReg, { message: '密码必须包含英文字母、数字和特殊符号（!@#$%^&*_），长度为6-20' })
  @Expose()
  password: string;

  @Matches(passwordReg, { message: '密码必须包含英文字母、数字和特殊符号（!@#$%^&*_），长度为6-20' })
  @Expose()
  newPassword: string;
}

export class UpdateUserDto extends BaseUpdateDto {
  @IsOptional()
  @IsInt({ message: '是否锁定字段必须是0或者1' })
  @Min(0, { message: '是否锁定字段必须是0或者1' })
  @Max(1, { message: '是否锁定字段必须是0或者1' })
  @Transform(v => v && parseInt(v), { toClassOnly: true })
  @Expose()
  isLock?: number;
}

export class QueryUsersDto extends PageGetDto {
  @IsOptional()
  @IsString()
  @Expose()
  username?: string;

  @IsOptional()
  @IsInt({ message: '是否锁定字段必须是0或者1' })
  @Min(0, { message: '是否锁定字段必须是0或者1' })
  @Max(1, { message: '是否锁定字段必须是0或者1' })
  @Transform(v => v && parseInt(v), { toClassOnly: true })
  @Expose()
  isLock?: number;
}
