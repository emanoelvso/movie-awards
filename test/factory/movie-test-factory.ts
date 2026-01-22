import { faker } from '@faker-js/faker';
import { Movie } from '@producerModule/persistence/entity/movie.entity';
import * as Factory from 'factory.ts';

export const movieFactory = Factory.Sync.makeFactory<Partial<Movie>>({
  id: Factory.each(() => faker.string.uuid()),
  year: Factory.each(() => faker.date.past().getFullYear()),
  title: Factory.each(() => faker.book.title()),
  studios: Factory.each(() => `[${faker.book.publisher()}]`),
  winner: Factory.each(() => faker.datatype.boolean()),
  updatedAt: Factory.each(() => faker.date.recent()),
  deletedAt: null,
});
