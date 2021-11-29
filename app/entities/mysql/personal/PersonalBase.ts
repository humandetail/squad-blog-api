import { PrimaryGeneratedColumn, Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../../BaseEntity';
import Picture from '../resource/Picture';
import User from '../sys/User';
import PersonalSkill from './PersonalSkill';
import PersonalWork from './PersonalWork';

@Entity({ name: 'personal_base' })
export default class PersonalBase extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.personalBases)
  user: User;

  @ManyToOne(() => Picture, picture => picture.personalBases)
  avatar: Picture;

  @OneToMany(() => PersonalSkill, personalSkill => personalSkill.base)
  personalSkills: PersonalSkill[];

  @OneToMany(() => PersonalWork, PersonalWork => PersonalWork.base)
  personalWorks: PersonalWork[];

  @Column({
    length: 32,
    comment: '昵称'
  })
  nickname: string;

  @Column({
    length: 20
  })
  qq: string;

  @Column({
    length: 128
  })
  blog: string;

  @Column({
    length: 128
  })
  github: string;

  @Column({
    length: 128
  })
  email: string;

  @Column({
    type: 'text',
    comment: '个人简介'
  })
  intro: string;

  @Column({
    name: 'is_default',
    type: 'tinyint',
    default: 0,
    unsigned: true,
    comment: '是否为默认'
  })
  isDefault: number;

  @Column({
    name: 'is_show_skills',
    type: 'tinyint',
    default: 0,
    unsigned: true,
    comment: '是否展示技能'
  })
  isShowSkills: number;

  @Column({
    name: 'is_show_works',
    type: 'tinyint',
    default: 0,
    unsigned: true,
    comment: '是否展示作品集'
  })
  isShowWorks: number;
}
