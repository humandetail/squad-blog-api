import { Column, Entity, ObjectId, ObjectIdColumn } from 'typeorm';
import { BaseEntity } from '../BaseEntity';

@Entity()
export default class Log extends BaseEntity {
  @ObjectIdColumn()
  id: ObjectId;

  @Column({
    name: 'username',
    length: 32,
    comment: '外键，用户名'
  })
  username: string;

  @Column({
    length: 32,
    comment: 'ip地址'
  })
  ip: string;

  @Column({
    comment: '动作'
  })
  action: string;

  @Column({
    comment: '模块'
  })
  module: string;

  @Column({
    comment: '内容'
  })
  content: string;

  @Column({
    comment: '结果'
  })
  result: string;

  @Column({
    name: 'created_at',
    comment: 'typeorm 查不出自动填充的日期字段，只能自己加一个用于统计了。'
  })
  created_at: Date;
}
