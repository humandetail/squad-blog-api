import { PrimaryGeneratedColumn, Column, Entity, OneToMany, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../BaseEntity';
import Post from '../post/Post';
import PostTemplate from './PostTemplate';
import PictureCategory from './PictureCategory';
import PersonalSkill from '../personal/PersonalSkill';
import PersonalBase from '../personal/PersonalBase';
import Setting from '../sys/Setting';

@Entity({ name: 'picture' })
export default class Picture extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => PictureCategory, cate => cate.pictures)
  category: PictureCategory;

  @Column({
    length: 64,
    comment: '图片名称'
  })
  name: string;

  @Column({
    name: 'qiniu_domain',
    length: 128,
    comment: 'qiniu oss 域名'
  })
  qiniuDomain: string;

  @Column({
    name: 'qiniu_key',
    length: 64,
    comment: 'qiniu 图片名称'
  })
  qiniuKey: string;

  @Column({
    comment: '图片宽度'
  })
  width: number;

  @Column({
    comment: '图片高度'
  })
  height: number;

  @Column({
    comment: '图片大小'
  })
  size: number;

  @OneToMany(() => Post, post => post.cover)
  posts: Post[];

  @OneToMany(() => PostTemplate, template => template.cover)
  postTemplates: Post[];

  @OneToMany(() => PersonalBase, personalBase => personalBase.avatar)
  personalBases: PersonalBase[];

  @OneToMany(() => PersonalSkill, personalSkill => personalSkill.icon)
  personalSkills: PersonalSkill[];

  @OneToMany(() => Setting, setting => setting.logo)
  settings: Setting[];
}
