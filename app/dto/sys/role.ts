import {
  Length,
  IsString,
  MaxLength,
  IsOptional,
  IsArray,
  IsInt,
  IsBoolean
} from 'class-validator';
import { Expose } from 'class-transformer';
import { BaseCreateDto, PageGetDto } from '../common/common';

export class CreateRoleDto extends BaseCreateDto {
  @Length(1, 32, { message: '角色名称不能超过32个字符' })
  @IsString({ message: '角色名称不能超过32个字符' })
  @Expose()
  name: string;

  @IsOptional()
  @MaxLength(255, { message: '备注不能超过255个字符' })
  @Expose()
  remarks?: string;

  @IsOptional()
  @IsBoolean()
  @Expose()
  isAdmin?: boolean;
}

export class UpdateRoleDto extends CreateRoleDto {}

export class RoleMenusDto {
  @IsArray({ message: '菜单必须是个 Array<number> 类型' })
  @IsInt({
    each: true,
    message: '菜单必须是个 Array<number> 类型'
  })
  @Expose()
  menus: number[];
}

export class QueryRolesDto extends PageGetDto {
  @IsOptional()
  @IsString()
  @Expose()
  keyword?: string;
}
