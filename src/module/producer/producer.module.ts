import { DynamicModule, Module } from '@nestjs/common';
import { PersistenceModule } from './persistence/persistence.module';
import { MovieRepository } from './persistence/repository/movie.repository';
import { ProducerRepository } from './persistence/repository/producer.repository';
import { ProducerController } from './http/rest/controller/producer.controller';
import { ProducerService } from './core/service/producer.service';
import path from 'path';
import { SeedConfig } from './persistence/interface/seed.config';

@Module({})
export class ProducerModule {
  static forRoot(seedConfig?: SeedConfig): DynamicModule {
    return {
      module: ProducerModule,
      imports: [
        PersistenceModule.forRoot({
          seedConfig: {
            csvPath:
              seedConfig?.csvPath ??
              path.join(process.cwd() + '/database/seed/Movielist.csv'),
            deleteBeforeInsert: seedConfig?.deleteBeforeInsert ?? true,
          },
        }),
      ],
      controllers: [ProducerController],
      providers: [ProducerService, MovieRepository, ProducerRepository],
    };
  }
}
