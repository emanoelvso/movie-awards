import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsArray, IsNumber, IsString } from 'class-validator';

class ProducerIntervalDto {
  @Expose()
  @IsString()
  @ApiProperty({ description: 'Producer name', default: 'John Doe' })
  producer: string;

  @IsNumber()
  @Expose()
  @ApiProperty({ description: 'Interval between wins', default: 1 })
  interval: number;

  @IsNumber()
  @Expose()
  @ApiProperty({ description: 'Year of the previous win', default: 2024 })
  previousWin: number;

  @IsNumber()
  @Expose()
  @ApiProperty({ description: 'Year of the following win', default: 2025 })
  followingWin: number;
}

export class ProducerIntervalResponseDto {
  @Expose()
  @IsArray()
  @ApiProperty({
    description: 'Producers with the min interval',
    default: [
      {
        producer: 'John Doe',
        interval: 1,
        previousWin: 2024,
        followingWin: 2025,
      },
    ],
  })
  min: ProducerIntervalDto[];

  @IsArray()
  @Expose()
  @ApiProperty({
    description: 'Producers with the max interval',
    default: [
      {
        producer: 'Foo Bar',
        interval: 10,
        previousWin: 2004,
        followingWin: 2024,
      },
    ],
  })
  max: ProducerIntervalDto[];
}
