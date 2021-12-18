import {
  Length,
  IsString,
  IsInt,
  Min,
  Max,
  MaxLength,
  IsOptional,
  Matches
} from 'class-validator';
import { Expose, Transform } from 'class-transformer';
import { BaseCreateDto, PageGetDto } from '../common/common';
import { permissionReg } from '../../libs/regexp';

export class CreateMenuDto extends BaseCreateDto {
  @Length(1, 32, { message: '菜单名称不能超过32个字符' })
  @IsString({ message: '菜单名称不能超过32个字符' })
  @Expose()
  name: string;

  @IsInt({ message: '上级菜单必须是个数字' })
  @Min(0, { message: '上级菜单必须是个数字' })
  @Transform(v => v && parseInt(v), { toClassOnly: true })
  @Expose()
  parentId: number;

  @IsInt({ message: '类型必须是个数字：1=菜单，2=操作' })
  @Min(1, { message: '类型必须是个数字：1=菜单，2=操作' })
  @Max(2, { message: '类型必须是个数字：1=菜单，2=操作' })
  @Transform(v => v && parseInt(v), { toClassOnly: true })
  @Expose()
  type: number;

  @IsOptional()
  @MaxLength(255)
  @Expose()
  router?: string;

  @IsOptional()
  @MaxLength(255)
  @Matches(permissionReg, { message: `权限代码格式不正确，${permissionReg}` })
  @Expose()
  permission?: string;

  @IsOptional()
  @MaxLength(255)
  @Expose()
  path?: string;

  @IsOptional()
  @MaxLength(255)
  @Expose()
  icon?: string;

  @IsOptional()
  @IsInt({ message: '是否缓存路由必须是个数字：1=是，0=否' })
  @Min(0, { message: '是否缓存路由必须是个数字：1=是，0=否' })
  @Max(1, { message: '是否缓存路由必须是个数字：1=是，0=否' })
  @Transform(v => v && parseInt(v), { toClassOnly: true })
  @Expose()
  isCache?: number;
}

export class UpdateMenuDto extends CreateMenuDto {}

export class QueryMenusDto extends PageGetDto {
  @IsOptional()
  @IsString()
  @Expose()
  keyword?: string;

  @IsOptional()
  @IsInt({ message: '是否查询全部必须是个数字：1=是，0=否' })
  @Min(0, { message: '是否查询全部必须是个数字：1=是，0=否' })
  @Max(1, { message: '是否查询全部必须是个数字：1=是，0=否' })
  @Transform(v => v && parseInt(v), { toClassOnly: true })
  @Expose()
  isAll: number;
}

export class QueryMenusByParentIdDto {
  @IsInt({ message: '上级菜单必须是个数字' })
  @Transform(v => v && parseInt(v), { toClassOnly: true })
  @Expose()
  parentId: number;
}
