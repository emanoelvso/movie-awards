import { ProducerRepository } from '@movieModule/persistence/repository/producer.repository';
import { Controller, Get } from '@nestjs/common';

@Controller('movie')
export class MovieController {
  constructor(private readonly producerRepository: ProducerRepository) {}
  @Get('/producers')
  async getProducers() {
    const producers = await this.producerRepository.find({
      relations: ['movies'],
    });

    const intervals: any[] = [];

    for (const producer of producers) {
      const wins = producer.movies
        .filter((m) => m.winner)
        .map((m) => m.year)
        .sort((a, b) => a - b);

      for (let i = 1; i < wins.length; i++) {
        intervals.push({
          producer: producer.name,
          interval: wins[i] - wins[i - 1],
          previousWin: wins[i - 1],
          followingWin: wins[i],
        });
      }
    }

    return intervals;
  }
}
