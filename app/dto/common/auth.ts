import {
  Matches
} from 'class-validator';
import { Expose } from 'class-transformer';
import { usernameReg, passwordReg } from '../../libs/regexp';

export class LoginDto {
  @Matches(usernameReg, { message: '用户名只能由字母或数字组成，长度为4-20' })
  @Expose()
  username: string;

  @Matches(passwordReg, { message: '密码必须包含英文字母、数字和特殊符号（!@#$%^&*_），长度为6-20' })
  @Expose()
  password: string;
}
