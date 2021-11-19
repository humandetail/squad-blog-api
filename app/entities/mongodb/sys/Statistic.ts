import { Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm';
import { BaseEntity } from '../BaseEntity';

@Entity()
export default class Statistic extends BaseEntity {
  @ObjectIdColumn()
  id: ObjectID;

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
}
