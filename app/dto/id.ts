import { IsInt } from 'class-validator';
import { Expose, Transform } from 'class-transformer';
export class Id {
  @IsInt()
  @Transform(v => parseInt(v), { toClassOnly: true })
  @Expose()
  id: number;

  name: string;
}
