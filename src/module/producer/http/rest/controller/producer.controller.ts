import { Controller, Get } from '@nestjs/common';
import { ProducerService } from '../../../core/service/producer.service';
import { ProducerIntervalResponseDto } from '../dto/response/interval-response.dto';

@Controller('producer')
export class ProducerController {
  constructor(private readonly producerService: ProducerService) {}
  @Get('/interval')
  async getProducersIntervals(): Promise<ProducerIntervalResponseDto> {
    return await this.producerService.getMinMaxIntervals();
  }
}
