import { DataSource } from 'typeorm';
import { Inject } from '@nestjs/common';
import { Producer } from '../entity/producer.entity';
import { DefaultTypeOrmRepository } from '../../infra/module/typeorm/repository/default-typeorm.repository';

export class ProducerRepository extends DefaultTypeOrmRepository<Producer> {
  constructor(@Inject(DataSource) readonly datasource: DataSource) {
    super(Producer, datasource);
  }
}
