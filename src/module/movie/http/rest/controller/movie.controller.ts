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

    const intervalsMap: Record<number, Record<string, any>[]> = {};

    for (const producer of producers) {
      const wins = producer.movies
        .filter((m) => m.winner)
        .map((m) => m.year)
        .sort((a, b) => a - b);

      if (wins.length > 1) {
        for (let i = 1; i < wins.length; i++) {
          const interval = wins[i] - wins[i - 1];
          if (intervalsMap[interval]) {
            intervalsMap[interval].push({
              producer: producer.name,
              interval: wins[i] - wins[i - 1],
              previousWin: wins[i - 1],
              followingWin: wins[i],
            });
          } else {
            intervalsMap[interval] = [
              {
                producer: producer.name,
                interval: wins[i] - wins[i - 1],
                previousWin: wins[i - 1],
                followingWin: wins[i],
              },
            ];
          }
        }
      }
    }

    const intervals = Object.keys(intervalsMap);
    const response = {
      min: intervalsMap[intervals[0]],
      max: intervalsMap[intervals[intervals.length - 1]],
    };

    return response;
  }
}
