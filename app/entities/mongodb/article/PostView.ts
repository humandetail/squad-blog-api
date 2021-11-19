import { Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm';
import { BaseEntity } from '../BaseEntity';

@Entity('post_view')
export default class PostView extends BaseEntity {
  @ObjectIdColumn()
  id: ObjectID;

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
}
