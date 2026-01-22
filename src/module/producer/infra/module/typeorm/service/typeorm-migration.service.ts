import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class TypeOrmMigrationService {
  constructor(@InjectDataSource() private readonly datasource: DataSource) {}

  async migrate(): Promise<void> {
    const pendingMigrations = await this.datasource.showMigrations();

    if (pendingMigrations) {
      const appliedMigrations = await this.datasource.runMigrations();
      console.log('Applied migrations', appliedMigrations);
    }
  }

  getDatasource(): DataSource {
    return this.datasource;
  }
}
