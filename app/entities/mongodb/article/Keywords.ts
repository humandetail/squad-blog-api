import { Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm';
import { BaseEntity } from '../BaseEntity';

@Entity()
export default class Keyword extends BaseEntity {
  @ObjectIdColumn()
  id: ObjectID;

  @Column({
    length: 32,
    comment: 'ip地址'
  })
  ip: string;

  @Column({
    comment: '关键字'
  })
  keyword: string;
}
