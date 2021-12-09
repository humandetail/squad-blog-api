import { PrimaryGeneratedColumn, Column, Entity, ManyToMany } from 'typeorm';
import { BaseEntity } from '../../BaseEntity';
import Role from './Role';

@Entity({ name: 'menu' })
export default class Menu extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'parent_id',
    unsigned: true,
    default: 0,
    comment: '上级菜单 id，0为一级菜单'
  })
  parentId: number;

  @Column({
    length: 32,
    comment: '菜单名称'
  })
  name: string;

  @Column({
    comment: '菜单路由地址（前端）'
  })
  router: string;

  @Column({
    comment: '操作权限代码'
  })
  permission: string;

  @Column({
    type: 'tinyint',
    unsigned: true,
    default: 1,
    comment: '权限类型：1=菜单；2=操作权限',
  })
  type: number;

  @Column({
    comment: '菜单按钮名称'
  })
  icon: string;

  @Column({
    comment: '文件路径'
  })
  path: string;

  @Column({
    name: 'is_cache',
    type: 'tinyint',
    unsigned: true,
    default: 0,
    comment: '是否缓存路由, 1=是；0=否'
  })
  isCache: number;

  @ManyToMany(() => Role, role => role.menus)
  roles: Role[];
}
