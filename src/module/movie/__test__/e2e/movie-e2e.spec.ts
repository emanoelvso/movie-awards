import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { MovieModule } from '../../movie.module';
import request from 'supertest';
import { App } from 'supertest/types';

describe('MovieController (e2e)', () => {
  let module: TestingModule;
  let app: INestApplication;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [MovieModule],
    }).compile();
    app = module.createNestApplication();

    await app.init();
  });

  afterAll(async () => {
    await module.close();
  });

  describe('/movie/producers (GET)', () => {
    it('should return min and max correctly', async () => {
      await request(app.getHttpServer() as App)
        .get('/movie/producers')
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
    });
  });
});
