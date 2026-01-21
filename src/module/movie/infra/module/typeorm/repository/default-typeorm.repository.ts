import {
  DataSource,
  DeleteResult,
  EntityTarget,
  FindManyOptions,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { DefaultEntity } from '../entity/default.entity';

export abstract class DefaultTypeOrmRepository<T extends DefaultEntity<T>> {
  private repository: Repository<T>;
  constructor(
    readonly entity: EntityTarget<T>,
    readonly datasSource: DataSource,
  ) {
    this.repository = datasSource.getRepository(entity);
  }

  create(entity: T): T {
    return this.repository.create(entity);
  }

  async find(filter: FindManyOptions<T>): Promise<T[]> {
    return this.repository.find(filter);
  }

  async findBy(filter: FindOptionsWhere<T>): Promise<T | null> {
    return this.repository.findOne({
      where: { ...filter },
    });
  }

  async save(entity: T): Promise<T> {
    return await this.repository.save(entity);
  }

  async findWhere(fields: FindOptionsWhere<T>): Promise<T[]> {
    return this.repository.findBy({
      ...fields,
    });
  }

  async deleteAll(): Promise<DeleteResult> {
    return this.repository.deleteAll();
  }

  async count(): Promise<number> {
    return this.repository.count();
  }
}
