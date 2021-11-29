/**
 * 文章管理 - 文章实体
 */

import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryColumn } from 'typeorm';
import { BaseEntity } from '../../BaseEntity';
import Category from './Category';
import Tag from './Tag';
import Picture from '../resource/Picture';
import PostTemplate from '../resource/PostTemplate';

@Entity({ name: 'post' })
export default class Post extends BaseEntity {
  @PrimaryColumn({
    type: 'char',
    length: 10,
    comment: '主键，使用10位的 nanoid'
  })
  id: string;

  @ManyToOne(() => Category, cate => cate.posts)
  category: Category;

  @ManyToMany(() => Tag)
  @JoinTable()
  tags: Tag[];

  @ManyToOne(() => Picture, picture => picture.posts)
  cover: Picture;

  @ManyToOne(() => PostTemplate, template => template.posts)
  template: PostTemplate;

  @Column({
    length: 255,
    unique: true,
    comment: '文章标题',
    default: ''
  })
  title: string;

  @Column({
    length: 500,
    comment: '摘要',
    default: ''
  })
  summary: string;

  @Column({
    type: 'text',
    comment: '文章内容 markdown 格式'
  })
  content: string;

  @Column({
    length: 50,
    default: '',
    comment: '文章作者'
  })
  author: string;

  @Column({
    length: 255,
    default: '',
    comment: '文章来源地址'
  })
  source: string;

  @Column({
    name: 'recommendation_index',
    default: 0,
    unsigned: true,
    comment: '推荐指数'
  })
  recommendationIndex: number;

  @Column({
    name: 'seo_title',
    length: 255,
    default: '',
    comment: '文章的 seo title'
  })
  seoTitle: string;

  @Column({
    name: 'seo_keywords',
    length: 255,
    default: '',
    comment: '文章的 seo keywords'
  })
  seoKeywords: string;

  @Column({
    name: 'seo_description',
    length: 500,
    default: '',
    comment: '文章的 seo description'
  })
  seoDescription: string;
}
