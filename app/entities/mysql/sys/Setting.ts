import { PrimaryGeneratedColumn, Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../BaseEntity';
import Picture from '../resource/Picture';

@Entity({ name: 'setting' })
export default class Setting extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Picture, picture => picture.settings)
  logo: Picture;

  @Column({
    name: 'site_name',
    length: 32,
    comment: '网站名称'
  })
  siteName: string;

  @Column({
    name: 'seo_title',
    length: 255,
    default: '',
    comment: '全局的 seo title'
  })
  seoTitle: string;

  @Column({
    name: 'seo_keywords',
    length: 255,
    default: '',
    comment: '全局的 seo keywords'
  })
  seoKeywords: string;

  @Column({
    name: 'seo_description',
    length: 500,
    default: '',
    comment: '全局的 seo description'
  })
  seoDescription: string;

  @Column({
    type: 'tinyint',
    comment: '网站运行状态'
  })
  status: number;
}
