import { PrimaryGeneratedColumn, Column, Entity, ManyToMany, OneToMany, JoinTable } from 'typeorm';
import { BaseEntity } from '../../BaseEntity';
import Menu from './Menu';
import User from './User';

@Entity({ name: 'role' })
export default class Role extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 32,
    comment: '角色名称'
  })
  name: string;

  @Column({
    length: 255,
    default: '',
    comment: '备注'
  })
  remarks: string;

  @ManyToMany(() => Menu)
  @JoinTable()
  menus: Menu[];

  @OneToMany(() => User, user => user.role)
  users: User[];
}
