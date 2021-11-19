import { Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export abstract class BaseEntity {
  @Column({
    length: 32,
    comment: '操作员'
  })
  operator: string;

  @Column({
    name: 'sort',
    default: 0,
    unsigned: true,
    comment: '排序值'
  })
  sort: number;

  @Column({
    name: 'is_show',
    type: 'tinyint',
    default: 0,
    unsigned: true,
    comment: '是否显示'
  })
  isShow: number;

  @CreateDateColumn({
    name: 'created_time'
  })
  createdTime: Date;

  @UpdateDateColumn({
    name: 'updated_time'
  })
  updatedTime: Date;
}
