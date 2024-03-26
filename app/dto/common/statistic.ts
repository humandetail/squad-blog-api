import {
  IsInt,
  IsString,
  IsOptional
} from 'class-validator';
import { Transform, Expose } from 'class-transformer';
import { StatisticRange } from '../../service/statistics/Statistics';

export class StatisticDto {
  @IsInt({ message: '请使用正确的时间范围' })
  @Transform(v => v && parseInt(v), { toClassOnly: true })
  @Expose()
  range: StatisticRange;
}

export class ReportDto {
  @IsString()
  @Expose()
  page: string;

  @IsOptional()
  @IsString()
  @Expose()
  source?: string;

  @IsOptional()
  @IsString()
  @Expose()
  ua?: string;
}
