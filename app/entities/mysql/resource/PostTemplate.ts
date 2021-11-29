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

  @OneToMany(() => Post, post => post.template)
  posts: Post[];

  @ManyToOne(() => Picture, picture => picture.posts)
  cover: Picture;
}
