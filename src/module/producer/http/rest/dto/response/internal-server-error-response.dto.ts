import { ApiProperty } from '@nestjs/swagger';

export class InternalServerErrorDto {
  @ApiProperty({ description: 'Status Code', default: 500 })
  status: number;

  @ApiProperty({
    description: 'Error message',
    default: 'Internal Server Error',
  })
  description: string;
}
