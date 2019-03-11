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
import { FeeEstimateService } from './fee-estimate.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '../../config/config.module';
import { ConfigService } from '../../config/config.service';
import { FeeEstimateCacheUpdateModule } from './fee-estimate-cache-update.module';
import { AuthModule } from '../Auth/auth.module';

describe('FeeEstimateCacheUpdate module', () => {
  let app: INestApplication;
  let mongoServer;
  let feeEstimateCacheUpdateModule;
  let feeEstimateService;
  let token;

  beforeEach(async () => {
    mongoServer = new MongoMemoryServer();
    const mongoUri = await mongoServer.getConnectionString();

    const module = await Test.createTestingModule({
      imports: [
        AuthModule,
        ConfigModule,
        MongooseModule.forRoot(mongoUri, { useNewUrlParser: true }),
        FeeEstimateCacheUpdateModule,
      ],
      controllers: [],
      providers: [FeeEstimateService],
    }).compile();

    feeEstimateService = module.get<FeeEstimateService>(FeeEstimateService);
    feeEstimateCacheUpdateModule = module.get<FeeEstimateCacheUpdateModule>(FeeEstimateCacheUpdateModule);

    app = module.createNestApplication();
    await app.init();

    const response = await request(app.getHttpServer()).get('/auth/token/:fake');
    token = response.body.accessToken;
  });

  it('updates cached data when updateCache() method is called', async (done) => {
    const response1 = await request(app.getHttpServer()).get('/fee-estimate/BTC').set('Authorization', `Bearer ${token}`);
    const response2 = await request(app.getHttpServer()).get('/fee-estimate/ETH').set('Authorization', `Bearer ${token}`);

    const coinData1 = await feeEstimateService.findOne({ code: 'BTC' });
    const coinData2 = await feeEstimateService.findOne({ code: 'ETH' });

    setTimeout(async () => {
      await feeEstimateCacheUpdateModule.updateCache();

      const coinData1After = await feeEstimateService.findOne({ code: 'BTC' });
      const coinData2After = await feeEstimateService.findOne({ code: 'ETH' });

      expect(coinData1.timestamp < coinData1After.timestamp).toBe(true);
      expect(coinData2.timestamp < coinData2After.timestamp).toBe(true);

      done();
    }, 2000);
  });

  afterAll(async () => {
    mongoServer.stop();
    await app.close();
  });
});
