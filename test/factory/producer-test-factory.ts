import { faker } from '@faker-js/faker';
import { Producer } from '@producerModule/persistence/entity/producer.entity';
import * as Factory from 'factory.ts';

export const producerFactory = Factory.Sync.makeFactory<Partial<Producer>>({
  id: Factory.each(() => faker.string.uuid()),
  name: Factory.each(() => faker.person.fullName()),
  updatedAt: Factory.each(() => faker.date.recent()),
  deletedAt: null,
});
