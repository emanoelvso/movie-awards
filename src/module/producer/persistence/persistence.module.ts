import { DynamicModule, Module } from '@nestjs/common';
import { TypeOrmPersistenceModule } from '../infra/module/typeorm/tyeporm-persistence.module';
import { Movie } from './entity/movie.entity';
import { MovieRepository } from './repository/movie.repository';
import { Producer } from './entity/producer.entity';
import { SeedService } from './service/seed.service';
import { SeedConfig } from './interface/seed.config';
import { ProducerRepository } from './repository/producer.repository';
import { CsvModule } from '@producerModule/infra/module/csv/csv.module';
import { CsvService } from '@producerModule/infra/module/csv/csv.service';

@Module({})
export class PersistenceModule {
  static forRoot(opts: {
    migrations?: string[];
    seedConfig: SeedConfig;
  }): DynamicModule {
    const { migrations } = opts || {};

    return {
      module: PersistenceModule,
      imports: [
        TypeOrmPersistenceModule.forRoot({
          migrations,
          entities: [Movie, Producer],
        }),
        CsvModule,
      ],
      providers: [
        MovieRepository,
        ProducerRepository,
        SeedService,
        { provide: SeedConfig, useValue: opts.seedConfig },
        CsvService,
      ],
      exports: [MovieRepository, ProducerRepository, SeedService],
    };
  }
}
