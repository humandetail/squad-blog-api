import { Column, Entity, ObjectId, ObjectIdColumn } from 'typeorm';
import { BaseEntity } from '../BaseEntity';

@Entity()
export default class Statistic extends BaseEntity {
  @ObjectIdColumn()
  id: ObjectId;

  @Column({
    length: 32,
    comment: 'ip地址'
  })
  ip: string;

  @Column({
    comment: '受访页面'
  })
  page: string;

  @Column({
    comment: '来源页面'
  })
  source: string;

  @Column({
    comment: '入口页面'
  })
  entry: string;

  @Column({
    comment: 'user agent'
  })
  ua: string;

  @Column({
    name: 'created_at',
    comment: 'typeorm 查不出自动填充的日期字段，只能自己加一个用于统计了。'
  })
  created_at: Date;
}
