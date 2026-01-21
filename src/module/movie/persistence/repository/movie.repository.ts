import { Inject } from '@nestjs/common';
import { DefaultTypeOrmRepository } from '../../infra/module/typeorm/repository/default-typeorm.repository';
import { DataSource } from 'typeorm';
import { Movie } from '../entity/movie.entity';

export class MovieRepository extends DefaultTypeOrmRepository<Movie> {
  constructor(@Inject(DataSource) readonly datasource: DataSource) {
    super(Movie, datasource);
  }
}
