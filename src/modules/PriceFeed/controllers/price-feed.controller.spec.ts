// Copyright (C) Atlas City Global <https://atlascity.io>
// This file is part of cryptowallet-api <https://github.com/atlascity/cryptowallet-api>.
//
// cryptowallet-api is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 2 of the License, or
// (at your option) any later version.
//
// cryptowallet-api is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with cryptowallet-api.  If not, see <http://www.gnu.org/licenses/>.

import * as request from 'supertest';
import envConfig from '../../../config/envConfig';
import MongoMemoryServer from 'mongodb-memory-server';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { PriceFeedController } from './price-feed.controller';
import { PriceFeedService } from '../price-feed.service';
import { PriceFeedModule } from '../price-feed.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '../../../config/config.module';
import { ConfigService } from '../../../config/config.service';

describe('PriceFeedController', () => {
  let app: INestApplication;
  let mongoServer;

  beforeEach(async () => {
    mongoServer = new MongoMemoryServer();
    const mongoUri = await mongoServer.getConnectionString();

    const module = await Test.createTestingModule({
      imports: [
        ConfigModule,
        MongooseModule.forRoot(mongoUri, { useNewUrlParser: true }),
        PriceFeedModule,
      ],
      controllers: [PriceFeedController],
      providers: [PriceFeedService],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  describe(':coin/:currency', () => {
    describe('validates parameters before passing the request to the controller', () => {
      it('responds with 200 and JSON when called with single parameters', async (done) => {
        return request(app.getHttpServer())
          .get('/price-feed/BTC/GBP')
          .expect(200)
          .expect('Content-Type', /json/)
          .then((response) => {
            done();
          })
      });

      it('responds with 200 and JSON when called with multiple parameters', async (done) => {
        return request(app.getHttpServer())
          .get('/price-feed/BTC,LTC/GBP,USD')
          .expect(200)
          .expect('Content-Type', /json/)
          .then((response) => {
            done();
          })
      });

      it('responds with 403 when called with invalid coin parameter', async (done) => {
        return request(app.getHttpServer())
          .get('/price-feed/BTC1/GBP,USD')
          .expect(422)
          .then((response) => {
            done();
          })
      });

      it('responds with 403 when called with invalid currency parameter', async (done) => {
        return request(app.getHttpServer())
          .get('/price-feed/BTC/1GBP,USD')
          .expect(422)
          .then((response) => {
            done();
          })
      });

      it('responds with 403 when called with incorrectly formatted parameters', async (done) => {
        return request(app.getHttpServer())
          .get('/price-feed/BTC, LTC/GBP,USD')
          .expect(422)
          .then((response) => {
            done();
          })
      });
    });

    afterAll(async () => {
      console.log('after all');
      mongoServer.stop();
      await app.close();
    });
  });
});
