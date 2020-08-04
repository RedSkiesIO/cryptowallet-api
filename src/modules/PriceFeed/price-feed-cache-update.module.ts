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
import { PriceFeedController } from './controllers/price-feed.controller';
import { PriceFeedService } from './price-feed.service';
import { PriceFeedSchema } from './schemas/price-feed.schema';
import { ConfigService } from '../../config/config.service';
import { DTO } from './interfaces/dto.interface';
import { PriceFeedDataInterfaceKeys } from './interfaces/price-feed-data.interface';
import { CacheUpdate } from '../../abstract/CacheUpdate';
import { AuthModule } from '../Auth/auth.module';

const bugsnagClient = bugsnag({
  apiKey: envConfig.BUGSNAG_KEY,
  logger: null,
});

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([{ name: 'PriceFeed', schema: PriceFeedSchema }]),
  ],
  exports: [],
  controllers: [PriceFeedController],
  providers: [PriceFeedService],
})
export class PriceFeedCacheUpdateModule extends CacheUpdate {
  protected readonly service: PriceFeedService;
  protected readonly configService: ConfigService;

  constructor(priceFeedService: PriceFeedService, configService: ConfigService) {
    super();
    this.service = priceFeedService;
    this.configService = configService;
    this.scheduleInit(this.configService.get('PRICEFEED_CRON'));
  }

  /**
   * Fetches fresh date from the external API
   * and updates a single cached document
   * @param {Object}   document
   * @param {Function} callback has to be called to continue code execution in series
   */
  protected async updateDocument(document, callback) {
    try {
      const supportedCurrencies = this.configService.get('CURRENCIES').split(',');
      const { code } = document;
      console.log(code);
      const response: any = await this.service.fetchExternalApi(code);

      const dtoRaw: Partial<DTO> = {
        code,
        timestamp: Math.round(+new Date() / 1000),
      };

      supportedCurrencies.forEach((currency) => {
        const fiat = currency.toLowerCase();
        const filtered = {
          TOTALVOLUME24HOURTO: response.data[code][`${fiat}_24h_vol`],
          PRICE: response.data[code][fiat],
          CHANGEPCT24HOUR: response.data[code][`${fiat}_24h_change`],
          MKTCAP: response.data[code][`${fiat}_market_cap`],
        };

        dtoRaw[currency] = filtered;
      });

      await this.service.update(
        { code },
        dtoRaw,
      );

      callback(null, { code });
    } catch (err) {
      bugsnagClient.notify(err);
    }
  }
}
