import { Injectable, OnModuleInit } from '@nestjs/common';
import { MovieRepository } from '../../persistence/repository/movie.repository';
import { ProducerRepository } from '../../persistence/repository/producer.repository';
import { CsvService } from '../../infra/module/csv/csv.service';
import { Movie } from '../../persistence/entity/movie.entity';
import { Producer } from '../../persistence/entity/producer.entity';
import path from 'path';

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
    private readonly movieRepository: MovieRepository,
    private readonly producerRepository: ProducerRepository,
    private readonly csvService: CsvService,
  ) {}
  async onModuleInit() {
    // await this.movieRepository.deleteAll();
    // await this.producerRepository.deleteAll();

    const records = await this.movieRepository.count();

    if (records === 0) {
      // TODO: ENV
      const rows = await this.csvService.parseCsv<CreateMovieData>(
        path.join(
          process.cwd() + '/src/module/movie/persistence/seed/Movielist.csv',
        ),
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
