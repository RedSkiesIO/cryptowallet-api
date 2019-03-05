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
import { PriceFeedService } from './price-feed.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '../../config/config.module';
import { ConfigService } from '../../config/config.service';
import { PriceFeedCacheUpdateModule } from './price-feed-cache-update.module';

describe('PriceFeedCacheUpdate module', () => {
  let app: INestApplication;
  let mongoServer;
  let priceFeedCacheUpdateModule;
  let priceFeedService;

  beforeEach(async () => {
    mongoServer = new MongoMemoryServer();
    const mongoUri = await mongoServer.getConnectionString();

    const module = await Test.createTestingModule({
      imports: [
        ConfigModule,
        MongooseModule.forRoot(mongoUri, { useNewUrlParser: true }),
        PriceFeedCacheUpdateModule,
      ],
      controllers: [],
      providers: [PriceFeedService],
    }).compile();

    priceFeedService = module.get<PriceFeedService>(PriceFeedService);
    priceFeedCacheUpdateModule = module.get<PriceFeedCacheUpdateModule>(PriceFeedCacheUpdateModule);

    app = module.createNestApplication();
    await app.init();
  });

  it('updates cached data when updateCache() method is called', async (done) => {
    const response1 = await request(app.getHttpServer()).get('/price-feed/BTC,LTC/ALL');
    const coinData1 = await priceFeedService.findOne({ code: 'BTC' });
    const coinData2 = await priceFeedService.findOne({ code: 'LTC' });

    setTimeout(async () => {
      await priceFeedCacheUpdateModule.updateCache();

      const coinData1After = await priceFeedService.findOne({ code: 'BTC' });
      const coinData2After = await priceFeedService.findOne({ code: 'LTC' });

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
