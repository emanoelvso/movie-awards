import { Module } from '@nestjs/common';
import { PersistenceModule } from './persistence/persistence.module';
import { MovieService } from './core/service/movie.service';
import { MovieRepository } from './persistence/repository/movie.repository';
import { ProducerRepository } from './persistence/repository/producer.repository';
import { CsvService } from './infra/module/csv/csv.service';
import { SeedService } from './core/service/seed.service';
import { MovieController } from './http/rest/controller/movie.controller';

@Module({
  imports: [PersistenceModule.forRoot()],
  controllers: [MovieController],
  providers: [
    MovieService,
    MovieRepository,
    ProducerRepository,
    CsvService,
    SeedService,
  ],
})
export class MovieModule {}
