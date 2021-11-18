import { Entity, ObjectID, ObjectIdColumn, Column } from 'typeorm';

@Entity()
class Statistics {
  @ObjectIdColumn()
  id: ObjectID;

  @Column()
  name: string;
}

export default Statistics;
