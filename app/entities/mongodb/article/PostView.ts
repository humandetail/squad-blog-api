import { Column, Entity, ObjectId, ObjectIdColumn } from 'typeorm';
import { BaseEntity } from '../BaseEntity';

@Entity('post_view')
export default class PostView extends BaseEntity {
  @ObjectIdColumn()
  id: ObjectId;

  @Column({
    name: 'post_id',
    type: 'char',
    length: 10,
    comment: '外键，文章id'
  })
  postId: string;

  @Column({
    length: 32,
    comment: 'ip地址'
  })
  ip: string;

  @Column({
    name: 'created_at',
    comment: 'typeorm 查不出自动填充的日期字段，只能自己加一个用于统计了。'
  })
  created_at: Date;
}
