import { PrimaryGeneratedColumn, Column, Entity, ManyToMany, JoinTable } from 'typeorm';
import { BaseEntity } from '../../BaseEntity';
import Post from './Post';

@Entity({ name: 'tag' })
export default class Tag extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 32,
    unique: true,
    comment: '标签名称'
  })
  name: string;

  @Column({
    name: 'display_name',
    length: 64,
    unique: true,
    comment: '用于展示的名称'
  })
  displayName: string;

  @ManyToMany(() => Post, post => post.tags)
  @JoinTable()
  posts: Post[];
}
