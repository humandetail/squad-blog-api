import { PrimaryGeneratedColumn, Column, Entity, ManyToMany, JoinTable } from 'typeorm';
import { BaseEntity } from '../../BaseEntity';
import Picture from '../resource/Picture';

@Entity({ name: 'personal_work' })
export default class PersonalWork extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToMany(() => Picture)
  @JoinTable()
  pictures: Picture[];

  @Column({
    length: 32,
    comment: '作品名称'
  })
  name: string;

  @Column({
    length: 1000,
    comment: '作品描述'
  })
  description: string;

  @Column({
    length: 500,
    comment: '作品链接地址，多个地址用逗号(",")分隔，可使用"[{ name: string; link: string; }]"格式JSON字符串'
  })
  link: string;

  @ManyToMany(() => PersonalWork, personalWork => personalWork.pictures)
  personalWorks: PersonalWork[];
}
