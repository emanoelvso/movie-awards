import { Expose } from 'class-transformer';
import { IsArray, IsNumber, IsString } from 'class-validator';

class ProducerIntervalDto {
  @Expose()
  @IsString()
  producer: string;

  @IsNumber()
  @Expose()
  interval: number;

  @IsNumber()
  @Expose()
  previousWin: number;

  @IsNumber()
  @Expose()
  followingWin: number;
}

export class ProducerIntervalResponseDto {
  @Expose()
  @IsArray()
  min: ProducerIntervalDto[];

  @IsArray()
  @Expose()
  max: ProducerIntervalDto[];
}
