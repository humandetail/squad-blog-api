import { PrimaryGeneratedColumn, Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../../BaseEntity';
import Picture from './Picture';

@Entity({ name: 'picture_category' })
export default class PictureCategory extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 32,
    comment: '分类名称'
  })
  name: string;

  @Column({
    name: 'display_name',
    length: 64,
    comment: '用于展示的名称'
  })
  displayName: string;

  @OneToMany(() => Picture, picture => picture.category)
  pictures: Picture[];
}
