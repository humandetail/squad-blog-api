import { PrimaryGeneratedColumn, Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../BaseEntity';
import Picture from '../resource/Picture';
import PersonalBase from './PersonalBase';

@Entity({ name: 'personal_skill' })
export default class PersonalSkill extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Picture, picture => picture.personalSkills)
  icon: Picture;

  @ManyToOne(() => PersonalBase, base => base.personalSkills)
  base: PersonalBase;

  @Column({
    length: 32,
    comment: '技能名称'
  })
  name: string;

  @Column({
    length: 255,
    comment: '技能描述',
    default: ''
  })
  description: string;
}
