import { PrimaryColumn, Column, Entity, OneToMany, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../BaseEntity';
import PersonalBase from '../personal/PersonalBase';
import Role from './Role';

@Entity({ name: 'user' })
export default class User extends BaseEntity {
  @PrimaryColumn({
    type: 'char',
    length: 10,
    comment: '主键，使用10位的 nanoid'
  })
  id: string;

  @Column({
    name: 'username',
    length: 32,
    comment: '用户名',
    unique: true
  })
  username: string;

  @Column({
    length: 64,
    comment: '密码'
  })
  password: string;

  @Column({
    length: 64,
    comment: '随机密码盐'
  })
  salt: string;

  @Column({
    name: 'is_lock',
    type: 'tinyint',
    comment: '是否锁定当前用户，1=是，0=否',
    default: 0
  })
  isLock: number;

  @Column({
    name: 'last_login',
    type: 'timestamp'
  })
  lastLogin: Date;

  @OneToMany(() => PersonalBase, base => base.user)
  personalBases: PersonalBase[];

  @ManyToOne(() => Role, role => role.users)
  role: Role;
}
