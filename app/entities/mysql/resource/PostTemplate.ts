import { PrimaryGeneratedColumn, Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../../BaseEntity';
import Post from '../post/Post';
import Picture from './Picture';

@Entity({ name: 'post_template' })
export default class PostTemplate extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 32,
    unique: true,
    comment: '模板名称'
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
    comment: 'qiniu 文件名称'
  })
  qiniuKey: string;

  @OneToMany(() => Post, post => post.template)
  posts: Post[];

  @ManyToOne(() => Picture, picture => picture.posts)
  cover: Picture;
}
