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

import bugsnag from '@bugsnag/js';
import envConfig from '../../config/envConfig';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PriceHistoryController } from './controllers/price-history.controller';
import { PriceHistoryService } from './price-history.service';
import { PriceHistorySchema } from './schemas/price-history.schema';
import { ConfigService } from '../../config/config.service';
import { CacheUpdate } from '../../abstract/CacheUpdate';
import { AuthModule } from '../Auth/auth.module';

const bugsnagClient = bugsnag(envConfig.BUGSNAG_KEY);

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([{ name: 'PriceHistory', schema: PriceHistorySchema }]),
  ],
  exports: [],
  controllers: [PriceHistoryController],
  providers: [PriceHistoryService],
})
export class PriceHistoryCacheUpdateModule extends CacheUpdate {
  protected readonly service: PriceHistoryService;
  protected readonly configService: ConfigService;

  constructor(priceHistoryService: PriceHistoryService, configService: ConfigService) {
    super();
    this.service = priceHistoryService;
    this.configService = configService;
    this.scheduleInit(this.configService.get('PRICEHISTORY_CRON'));
  }

  /**
   * Fetches fresh date from the external API
   * and updates a single cached document
   * @param {Object}   document
   * @param {Function} callback has to be called to continue code execution in series
   */
   protected async updateDocument(document, callback) {
    try {
      const {
        code,
        currency,
        period,
      } = document;

      const freshData: any = await this.service.fetchExternalApi(code, currency, period);

      await this.service.update(
        { code, currency, period },
        { data: freshData.data.Data, timestamp: Math.round(+new Date() / 1000) },
      );

      callback(null, { code, currency, period });
    } catch (err) {
      bugsnagClient.notify(err);
    }
  }
}
