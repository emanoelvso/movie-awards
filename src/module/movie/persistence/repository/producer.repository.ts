import { DataSource } from 'typeorm';
import { DefaultTypeOrmRepository } from '../../infra/module/typeorm/repository/default-typeorm.repository';
import { Producer } from '../entity/producer.entity';
import { Inject } from '@nestjs/common';

export class ProducerRepository extends DefaultTypeOrmRepository<Producer> {
  constructor(@Inject(DataSource) readonly datasource: DataSource) {
    super(Producer, datasource);
  }
}
