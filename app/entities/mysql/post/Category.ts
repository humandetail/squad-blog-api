import { PrimaryGeneratedColumn, Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../../BaseEntity';
import Post from './Post';

@Entity({ name: 'category' })
export default class Category extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 32,
    unique: true,
    comment: '分类名称'
  })
  name: string;

  @Column({
    name: 'display_name',
    length: 64,
    unique: true,
    comment: '用于展示的名称'
  })
  displayName: string;

  @OneToMany(() => Post, post => post.category)
  posts: Post[];
}
