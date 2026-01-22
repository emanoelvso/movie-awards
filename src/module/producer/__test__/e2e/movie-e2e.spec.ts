import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { testDbClient } from '@testInfra/knex.database';
import { ProducerModule } from '../../producer.module';
import { movieFactory } from '@testInfra/factory/movie-test-factory';
import { producerFactory } from '@testInfra/factory/producer-test-factory';

describe('ProducerController (e2e)', () => {
  let module: TestingModule;
  let app: INestApplication;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [ProducerModule.forRoot()],
    }).compile();
    app = module.createNestApplication();

    await app.init();
  });

  afterAll(async () => {
    await app.close();
    await module.close();
  });

  describe('/movie/producers (GET)', () => {
    it('should return min and max correctly', async () => {
      await request(app.getHttpServer() as App)
        .get('/producer/interval')
        .expect(HttpStatus.OK)
        .expect((response) => {
          expect(response.body).toMatchObject({
            min: [
              {
                producer: 'Joel Silver',
                interval: 1,
                previousWin: 1990,
                followingWin: 1991,
              },
            ],
            max: [
              {
                producer: 'Matthew Vaughn',
                interval: 13,
                previousWin: 2002,
                followingWin: 2015,
              },
            ],
          });
        });

      // Check DB filled
      expect(await testDbClient('movie').count()).toEqual([
        { 'count(*)': 206 },
      ]);
      expect(await testDbClient('producer').count()).toEqual([
        { 'count(*)': 359 },
      ]);
    });

    it('should return empty array when database is empty', async () => {
      const server = request(app.getHttpServer() as App);

      await testDbClient('movie').del();
      await testDbClient('producer').del();

      await server
        .get('/producer/interval')
        .expect(HttpStatus.OK)
        .expect((response) => {
          expect(response.body).toMatchObject({
            min: [],
            max: [],
          });
        });

      // Check DB empty
      expect(await testDbClient('movie').count()).toEqual([{ 'count(*)': 0 }]);
      expect(await testDbClient('producer').count()).toEqual([
        { 'count(*)': 0 },
      ]);
    });

    it('should return 0, if producer wins in the same year', async () => {
      const server = request(app.getHttpServer() as App);

      await testDbClient('movie').del();
      await testDbClient('producer').del();

      const movie1 = movieFactory.build({ year: 2000, winner: true });
      const movie2 = movieFactory.build({ year: 2000, winner: true });
      const movie3 = movieFactory.build({ year: 2000, winner: true });
      const movie4 = movieFactory.build({ year: 2020, winner: true });

      const producer1 = producerFactory.build();
      const producer2 = producerFactory.build();

      await testDbClient('movie').insert([movie1, movie2, movie3, movie4]);

      await testDbClient('producer').insert([producer1, producer2]);

      await testDbClient('movie_producers_producer').insert([
        { movieId: movie1.id, producerId: producer1.id },
        { movieId: movie2.id, producerId: producer1.id },
        { movieId: movie3.id, producerId: producer2.id },
        { movieId: movie4.id, producerId: producer2.id },
      ]);

      await server
        .get('/producer/interval')
        .expect(HttpStatus.OK)
        .expect((response) => {
          expect(response.body).toMatchObject({
            min: [
              {
                producer: producer1.name,
                interval: 0,
                previousWin: 2000,
                followingWin: 2000,
              },
            ],
            max: [
              {
                producer: producer2.name,
                interval: 20,
                previousWin: 2000,
                followingWin: 2020,
              },
            ],
          });
        });

      // Check DB empty
      expect(await testDbClient('movie').count()).toEqual([{ 'count(*)': 4 }]);
      expect(await testDbClient('producer').count()).toEqual([
        { 'count(*)': 2 },
      ]);
    });

    it('should return multiple', async () => {
      const server = request(app.getHttpServer() as App);

      await testDbClient('movie').del();
      await testDbClient('producer').del();

      const movie1 = movieFactory.build({ year: 2000, winner: true });
      const movie2 = movieFactory.build({ year: 2001, winner: true });
      const movie3 = movieFactory.build({ year: 2015, winner: true });
      const movie4 = movieFactory.build({ year: 2016, winner: true });
      const movie5 = movieFactory.build({ year: 2000, winner: true });
      const movie6 = movieFactory.build({ year: 2020, winner: true });
      const movie7 = movieFactory.build({ year: 1980, winner: true });
      const movie8 = movieFactory.build({ year: 2000, winner: true });

      const producer1 = producerFactory.build();
      const producer2 = producerFactory.build();
      const producer3 = producerFactory.build();
      const producer4 = producerFactory.build();

      await testDbClient('movie').insert([
        movie1,
        movie2,
        movie3,
        movie4,
        movie5,
        movie6,
        movie7,
        movie8,
      ]);

      await testDbClient('producer').insert([
        producer1,
        producer2,
        producer3,
        producer4,
      ]);

      await testDbClient('movie_producers_producer').insert([
        { movieId: movie1.id, producerId: producer1.id },
        { movieId: movie2.id, producerId: producer1.id },
        { movieId: movie3.id, producerId: producer2.id },
        { movieId: movie4.id, producerId: producer2.id },
        { movieId: movie5.id, producerId: producer3.id },
        { movieId: movie6.id, producerId: producer3.id },
        { movieId: movie7.id, producerId: producer4.id },
        { movieId: movie8.id, producerId: producer4.id },
      ]);

      await server
        .get('/producer/interval')
        .expect(HttpStatus.OK)
        .expect((response) => {
          expect(response.body).toMatchObject({
            min: [
              {
                producer: producer1.name,
                interval: 1,
                previousWin: 2000,
                followingWin: 2001,
              },
              {
                producer: producer2.name,
                interval: 1,
                previousWin: 2015,
                followingWin: 2016,
              },
            ],
            max: [
              {
                producer: producer3.name,
                interval: 20,
                previousWin: 2000,
                followingWin: 2020,
              },
              {
                producer: producer4.name,
                interval: 20,
                previousWin: 1980,
                followingWin: 2000,
              },
            ],
          });
        });

      // Check DB empty
      expect(await testDbClient('movie').count()).toEqual([{ 'count(*)': 8 }]);
      expect(await testDbClient('producer').count()).toEqual([
        { 'count(*)': 4 },
      ]);
    });
  });
});
