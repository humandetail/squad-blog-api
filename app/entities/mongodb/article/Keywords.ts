import { Column, Entity, ObjectId, ObjectIdColumn } from 'typeorm';
import { BaseEntity } from '../BaseEntity';

@Entity()
export default class Keyword extends BaseEntity {
  @ObjectIdColumn()
  id: ObjectId;

  @Column({
    length: 32,
    comment: 'ip地址'
  })
  ip: string;

  @Column({
    comment: '关键字'
  })
  keyword: string;

  @Column({
    name: 'created_at',
    comment: 'typeorm 查不出自动填充的日期字段，只能自己加一个用于统计了。'
  })
  created_at: Date;
}
