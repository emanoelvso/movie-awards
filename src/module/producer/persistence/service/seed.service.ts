import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { MovieRepository } from '../repository/movie.repository';
import { ProducerRepository } from '../repository/producer.repository';
import { CsvService } from '../../infra/module/csv/csv.service';
import { Movie } from '../entity/movie.entity';
import { Producer } from '../entity/producer.entity';
import { SeedConfig } from '../interface/seed.config';

export interface CreateMovieData {
  year: string;
  title: string;
  studios: string;
  producers: string;
  winner?: string | null;
}

@Injectable()
export class SeedService implements OnModuleInit {
  constructor(
    @Inject(SeedConfig) private seedConfig: SeedConfig,
    private readonly movieRepository: MovieRepository,
    private readonly producerRepository: ProducerRepository,
    private readonly csvService: CsvService,
  ) {}
  async onModuleInit() {
    if (this.seedConfig.deleteBeforeInsert) {
      await this.deleteAll();
    }

    const records = await this.movieRepository.count();

    if (records === 0) {
      const rows = await this.csvService.parseCsv<CreateMovieData>(
        this.seedConfig.csvPath,
      );

      for (const row of rows) {
        const movie = new Movie({
          year: parseInt(row.year, 10),
          title: row.title,
          studios: row.studios
            .split(/,|\sand\s/)
            .map((item) => item.trim())
            .filter((item) => item.length > 0),
          winner: row.winner === 'yes',
        });

        movie.producers = await this.upsertProducers(row.producers);

        await this.movieRepository.save(movie);
      }
    }
  }

  private async deleteAll(): Promise<void> {
    await this.movieRepository.deleteAll();
    await this.producerRepository.deleteAll();
  }

  private async upsertProducers(raw: string): Promise<Producer[]> {
    if (!raw) return [];

    const names = raw
      .split(/,|\sand\s/)
      .map((item) => item.trim())
      .filter((item) => item.length > 0);

    const producers: Producer[] = [];

    for (const name of names) {
      let producer = await this.producerRepository.findBy({ name });

      if (!producer) {
        producer = new Producer({
          name: name,
        });

        await this.producerRepository.save(producer);
      }
      producers.push(producer);
    }

    return producers;
  }
}
