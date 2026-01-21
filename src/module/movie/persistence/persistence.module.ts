import { DynamicModule, Module } from '@nestjs/common';
import { TypeOrmPersistenceModule } from '../infra/module/typeorm/tyeporm-persistence.module';
import { Movie } from './entity/movie.entity';
import { MovieRepository } from './repository/movie.repository';
import { Producer } from './entity/producer.entity';

@Module({})
export class PersistenceModule {
  static forRoot(opts?: { migrations?: string[] }): DynamicModule {
    const { migrations } = opts || {};

    return {
      module: PersistenceModule,
      imports: [
        TypeOrmPersistenceModule.forRoot({
          migrations,
          entities: [Movie, Producer],
        }),
      ],
      providers: [MovieRepository],
      exports: [MovieRepository],
    };
  }
}
