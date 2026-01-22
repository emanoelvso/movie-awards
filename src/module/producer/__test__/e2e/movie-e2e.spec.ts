import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { testDbClient } from '@testInfra/knex.database';
import { ProducerModule } from '../../producer.module';

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
  });
});
