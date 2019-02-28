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
  let priceFeedService;
  let configService;

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

    priceFeedService = module.get<PriceFeedService>(PriceFeedService);
    configService = module.get<ConfigService>(ConfigService);

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
          });
      });

      it('responds with 200 and JSON when called with multiple parameters', async (done) => {
        return request(app.getHttpServer())
          .get('/price-feed/BTC,LTC/GBP,USD')
          .expect(200)
          .expect('Content-Type', /json/)
          .then((response) => {
            done();
          });
      });

      it('responds with 422 when called with invalid coin parameter', async (done) => {
        return request(app.getHttpServer())
          .get('/price-feed/BTC1/GBP,USD')
          .expect(422)
          .then((response) => {
            done();
          });
      });

      it('responds with 422 when called with invalid currency parameter', async (done) => {
        return request(app.getHttpServer())
          .get('/price-feed/BTC/1GBP,USD')
          .expect(422)
          .then((response) => {
            done();
          });
      });

      it('responds with 422 when called with incorrectly formatted parameters', async (done) => {
        return request(app.getHttpServer())
          .get('/price-feed/BTC, LTC/GBP,USD')
          .expect(422)
          .then((response) => {
            done();
          });
      });

      it('responds with 422 when unsupported currency is requested', async (done) => {
        return request(app.getHttpServer())
          .get('/price-feed/BTC,LTC/XXX')
          .expect(422)
          .then((response) => {
            done();
          });
      });
    });

    describe('processes the request correctly', () => {
      it('fetches the data from the external API and caches it in the DB, responds', async (done) => {
        return request(app.getHttpServer())
          .get('/price-feed/BTC,LTC/GBP,USD')
          .expect(200)
          .then(async (response) => {
            expect(response.body.length).toBe(2);
            response.body.forEach((coinData) => {
              expect(['GBP', 'USD'].includes(coinData.code));
            });

            const priceFeedData = await priceFeedService.findAll();
            expect(priceFeedData.length).toBe(2);

            const supportedCurrencies = configService.get('CURRENCIES').split(',');
            const priceFeedDataBTC = await priceFeedService.findOne({ code: 'BTC' });
            expect(priceFeedDataBTC.code).toBe('BTC');
            supportedCurrencies.forEach((currency) => {
               expect(priceFeedDataBTC[currency]).toBeTruthy();
            });

            done();
          });
      });

      it('returns all the currencies if parameter is set to "ALL"', async (done) => {
        return request(app.getHttpServer())
          .get('/price-feed/BTC,LTC,ETH/ALL')
          .expect(200)
          .then(async (response) => {
            expect(response.body.length).toBe(3);
            const supportedCurrencies = configService.get('CURRENCIES').split(',');
            response.body.forEach((coinData) => {
              supportedCurrencies.forEach((currency) => {
                expect(coinData[currency]).toBeTruthy();
              });
            });

            done();
          });
      });

      it('returns only selected currency if requested', async (done) => {
        return request(app.getHttpServer())
          .get('/price-feed/BTC,LTC,ETH/GBP')
          .expect(200)
          .then(async (response) => {
            expect(response.body.length).toBe(3);
            const supportedCurrencies = configService.get('CURRENCIES').split(',');
            response.body.forEach((coinData) => {
              expect(coinData.code).toBeTruthy();
              expect(coinData.GBP).toBeTruthy();
            });

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
