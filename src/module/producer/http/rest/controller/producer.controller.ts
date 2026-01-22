import { Controller, Get, InternalServerErrorException } from '@nestjs/common';
import { ProducerService } from '../../../core/service/producer.service';
import { ProducerIntervalResponseDto } from '../dto/response/interval-response.dto';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';

@Controller('producer')
export class ProducerController {
  constructor(private readonly producerService: ProducerService) {}

  @ApiOperation({
    summary: 'Producers win interval',
    description: 'Return the min and max range interval between producer wins',
  })
  @ApiOkResponse({
    description: 'Success response',
    type: ProducerIntervalResponseDto,
  })
  @Get('/interval')
  async getProducersIntervals(): Promise<ProducerIntervalResponseDto> {
    try {
      return await this.producerService.getMinMaxIntervals();
    } catch (error) {
      console.error('Error retrieving the producer intervals', error);
      throw new InternalServerErrorException();
    }
  }
}
