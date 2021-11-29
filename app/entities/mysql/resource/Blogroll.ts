import { PrimaryGeneratedColumn, Column, Entity } from 'typeorm';
import { BaseEntity } from '../../BaseEntity';

@Entity({ name: 'blogroll' })
export default class Blogroll extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 32,
    comment: '友情链接名称',
    unique: true
  })
  name: string;

  @Column({
    length: 128,
    comment: '链接地址',
    unique: true
  })
  link: string;

  @Column({
    length: 255,
    comment: '备注信息'
  })
  remarks: string;
}
