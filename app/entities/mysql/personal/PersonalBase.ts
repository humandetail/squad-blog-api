import { PrimaryGeneratedColumn, Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../BaseEntity';
import Picture from '../resource/Picture';
import User from '../sys/User';

@Entity({ name: 'personalBase' })
export default class PersonalBase extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.personalBases)
  user: User;

  @ManyToOne(() => Picture, picture => picture.personalBases)
  avatar: Picture;

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
}
