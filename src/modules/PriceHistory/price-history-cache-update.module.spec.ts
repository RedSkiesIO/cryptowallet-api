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
import envConfig from '../../config/envConfig';
import MongoMemoryServer from 'mongodb-memory-server';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { PriceHistoryService } from './price-history.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '../../config/config.module';
import { ConfigService } from '../../config/config.service';
import { PriceHistoryCacheUpdateModule } from './price-history-cache-update.module';
import { AuthModule } from '../Auth/auth.module';

describe('PriceHistoryCacheUpdate module', () => {
  let app: INestApplication;
  let mongoServer;
  let priceHistoryCacheUpdateModule;
  let priceHistoryService;
  let token;

  beforeEach(async () => {
    mongoServer = new MongoMemoryServer();
    const mongoUri = await mongoServer.getConnectionString();

    const module = await Test.createTestingModule({
      imports: [
        AuthModule,
        ConfigModule,
        MongooseModule.forRoot(mongoUri, { useNewUrlParser: true }),
        PriceHistoryCacheUpdateModule,
      ],
      controllers: [],
      providers: [PriceHistoryService],
    }).compile();

    priceHistoryService = module.get<PriceHistoryService>(PriceHistoryService);
    priceHistoryCacheUpdateModule = module.get<PriceHistoryCacheUpdateModule>(PriceHistoryCacheUpdateModule);

    app = module.createNestApplication();
    await app.init();

    const response = await request(app.getHttpServer()).get('/auth/token/:fake');
    token = response.body.accessToken;
  });

  it('updates cached data when updateCache() method is called', async (done) => {
    const response1 = await request(app.getHttpServer()).get('/price-history/BTC/GBP/day').set('Authorization', `Bearer ${token}`);
    const response2 = await request(app.getHttpServer()).get('/price-history/ETH/USD/week').set('Authorization', `Bearer ${token}`);

    const response1Data = await priceHistoryService.findOne({ code: 'BTC', currency: 'GBP', period: 'day' });
    const response2Data = await priceHistoryService.findOne({ code: 'ETH', currency: 'USD', period: 'week' });

    setTimeout(async () => {
      await priceHistoryCacheUpdateModule.updateCache();

      const response1After = await request(app.getHttpServer()).get('/price-history/BTC/GBP/day').set('Authorization', `Bearer ${token}`);
      const response2After = await request(app.getHttpServer()).get('/price-history/ETH/USD/week').set('Authorization', `Bearer ${token}`);

      const response1DataAfter = await priceHistoryService.findOne({ code: 'BTC', currency: 'GBP', period: 'day' });
      const response2DataAfter = await priceHistoryService.findOne({ code: 'ETH', currency: 'USD', period: 'week' });

      expect(response1.body.timestamp < response1After.body.timestamp).toBe(true);
      expect(response2.body.timestamp < response2After.body.timestamp).toBe(true);

      expect(response1Data.timestamp < response1DataAfter.timestamp).toBe(true);
      expect(response2Data.timestamp < response2DataAfter.timestamp).toBe(true);

      done();
    }, 3000);
  });

  afterAll(async () => {
    mongoServer.stop();
    await app.close();
  });
});
