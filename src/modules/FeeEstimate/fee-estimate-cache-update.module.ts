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
import { FeeEstimateController } from './controllers/fee-estimate.controller';
import { FeeEstimateService } from './fee-estimate.service';
import { FeeEstimateSchema } from './schemas/fee-estimate.schema';
import { ConfigService } from '../../config/config.service';
import { CacheUpdate } from '../../abstract/CacheUpdate';
import { AuthModule } from '../Auth/auth.module';

const bugsnagClient = bugsnag(envConfig.BUGSNAG_KEY);

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'FeeEstimate', schema: FeeEstimateSchema }]),
    AuthModule,
  ],
  exports: [],
  controllers: [FeeEstimateController],
  providers: [FeeEstimateService],
})
export class FeeEstimateCacheUpdateModule extends CacheUpdate {
  protected readonly service: FeeEstimateService;
  protected readonly configService: ConfigService;

  constructor(feeEstimateService: FeeEstimateService, configService: ConfigService) {
    super();
    this.service = feeEstimateService;
    this.configService = configService;
    this.scheduleInit(this.configService.get('FEEESTIMATE_CRON'));
  }

  /**
   * Fetches fresh date from the external API
   * and updates a single cached document
   * @param {Object}   document
   * @param {Function} callback has to be called to continue code execution in series
   */
  protected async updateDocument(document, callback) {
    try {
      const { code } = document;
      const freshData: any = await this.service.fetchExternalApi(code);

      await this.service.update(
        { code },
        { data: freshData, timestamp: Math.round(+new Date() / 1000) },
      );

      callback(null, { code });
    } catch (err) {
      bugsnagClient.notify(err);
    }
  }
}
