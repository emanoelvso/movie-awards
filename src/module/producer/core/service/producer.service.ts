import { Injectable } from '@nestjs/common';
import { ProducerRepository } from '../..//persistence/repository/producer.repository';

interface ProducerInterval {
  producer: string;
  interval: number;
  previousWin: number;
  followingWin: number;
}

@Injectable()
export class ProducerService {
  constructor(private readonly producerRepository: ProducerRepository) {}

  async getMinMaxIntervals(): Promise<{
    min: ProducerInterval[];
    max: ProducerInterval[];
  }> {
    const producers = await this.producerRepository.find({
      relations: ['movies'],
    });

    const intervalsMap: Record<number, ProducerInterval[]> = {};

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
    return intervals.length > 0
      ? {
          min: intervalsMap[intervals[0]] as ProducerInterval[],
          max: intervalsMap[
            intervals[intervals.length - 1]
          ] as ProducerInterval[],
        }
      : { min: [], max: [] };
  }
}
