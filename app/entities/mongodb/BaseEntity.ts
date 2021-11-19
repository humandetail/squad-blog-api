import { CreateDateColumn, UpdateDateColumn } from 'typeorm';

export abstract class BaseEntity {
  @CreateDateColumn({
    name: 'created_time'
  })
  createdTime: Date;

  @UpdateDateColumn({
    name: 'updated_time'
  })
  updatedTime: Date;
}
