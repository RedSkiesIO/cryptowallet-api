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
import { PriceHistoryController } from './price-history.controller';
import { PriceHistoryService } from '../price-history.service';
import { PriceHistoryModule } from '../price-history.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '../../../config/config.module';
import { ConfigService } from '../../../config/config.service';

describe('PriceHistoryController', () => {
  let app: INestApplication;
  let mongoServer;
  let priceHistoryService;
  let configService;

  beforeEach(async () => {
    mongoServer = new MongoMemoryServer();
    const mongoUri = await mongoServer.getConnectionString();

    const module = await Test.createTestingModule({
      imports: [
        ConfigModule,
        MongooseModule.forRoot(mongoUri, { useNewUrlParser: true }),
        PriceHistoryModule,
      ],
      controllers: [PriceHistoryController],
      providers: [PriceHistoryService],
    }).compile();

    priceHistoryService = module.get<PriceHistoryService>(PriceHistoryService);
    configService = module.get<ConfigService>(ConfigService);

    app = module.createNestApplication();
    await app.init();
  });

  describe('/price-history/:coin/:currency/:period', () => {
    describe('validates parameters before passing the request to the controller', () => {
      it('responds with 200 and JSON when called correctly', async (done) => {
        return request(app.getHttpServer())
          .get('/price-history/BTC/GBP/day')
          .expect(200)
          .expect('Content-Type', /json/)
          .then((response) => {
            done();
          });
      });

      it('responds with 422 and JSON when called with invalid coin code parameter', async (done) => {
        return request(app.getHttpServer())
          .get('/price-history/qwe/GBP/day')
          .expect(422)
          .expect('Content-Type', /json/)
          .then((response) => {
            done();
          });
      });

      it('responds with 422 and JSON when called with invalid currency parameter', async (done) => {
        return request(app.getHttpServer())
          .get('/price-history/BTC/qwW/day')
          .expect(422)
          .expect('Content-Type', /json/)
          .then((response) => {
            done();
          });
      });

      it('responds with 422 and JSON when called with unsupported currency', async (done) => {
        return request(app.getHttpServer())
          .get('/price-history/BTC/PPP/day')
          .expect(422)
          .expect('Content-Type', /json/)
          .then((response) => {
            done();
          });
      });

      it('responds with 422 and JSON when called with invalid period', async (done) => {
        return request(app.getHttpServer())
          .get('/price-history/BTC/USD/quater')
          .expect(422)
          .expect('Content-Type', /json/)
          .then((response) => {
            done();
          });
      });
    });

    describe('processes the request correctly', () => {
      it('fetches the data from the external API and caches it in the DB, responds', async (done) => {
        return request(app.getHttpServer())
          .get('/price-history/BTC/GBP/month')
          .expect(200)
          .then(async (response) => {
            expect(response.body.code).toBe('BTC');
            expect(response.body.currency).toBe('GBP');
            expect(response.body.period).toBe('month');
            expect(response.body.data).toBeTruthy();

            let priceHistoryData = await priceHistoryService.findAll();
            expect(priceHistoryData.length).toBe(1);
            priceHistoryData = await priceHistoryService.findOne({
              code: 'BTC',
              currency: 'GBP',
              period: 'month',
            });

            expect(priceHistoryData.code).toBe('BTC');
            expect(priceHistoryData.currency).toBe('GBP');
            expect(priceHistoryData.period).toBe('month');
            expect(priceHistoryData.data).toBeTruthy();

            done();
          });
      });

      it('uses cached data on subsequent requests', async (done) => {
        let timestamp;

        return request(app.getHttpServer())
          .get('/price-history/ETH/USD/week')
          .expect(200)
          .then((response) => {
            timestamp = response.body.timestamp;
          })
          .then(() => {
            request(app.getHttpServer())
              .get('/price-history/ETH/USD/week')
              .expect(200)
              .then((response) => {
                expect(response.body.timestamp === timestamp);
                done();
              });
          });
      });

      it('responds with correct data for period: "day"', async (done) => {
        return request(app.getHttpServer())
          .get('/price-history/LTC/EUR/day')
          .expect(200)
          .then((response) => {
            expect(response.body.period).toBe('day');
            done();
          });
      });

      it('responds with correct data for period: "week"', async (done) => {
        return request(app.getHttpServer())
          .get('/price-history/BTC/EUR/week')
          .expect(200)
          .then((response) => {
            expect(response.body.period).toBe('week');
            done();
          });
      });

      it('responds with correct data for period: "month"', async (done) => {
        return request(app.getHttpServer())
          .get('/price-history/ETH/EUR/month')
          .expect(200)
          .then((response) => {
            expect(response.body.period).toBe('month');
            done();
          });
      });
    });
  });

  afterAll(async () => {
    mongoServer.stop();
    await app.close();
  });
});
