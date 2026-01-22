import { DynamicModule, Module } from '@nestjs/common';
import { DefaultEntity } from './entity/default.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import path from 'path';

@Module({})
export class TypeOrmPersistenceModule {
  static forRoot(options: {
    migrations?: string[];
    entities?: Array<typeof DefaultEntity>;
  }): DynamicModule {
    return {
      module: TypeOrmPersistenceModule,
      imports: [
        TypeOrmModule.forRootAsync({
          useFactory: () => {
            return {
              type: 'better-sqlite3',
              logging: false,
              autoLoadEntities: false,
              synchronize: false,
              migrationsTableName: 'typeorm_migrations',
              database: path.join(process.cwd() + '/database/database.sqlite'),
              ...options,
            };
          },
        }),
      ],
    };
  }
}
