// Copyright (C) Atlas City Global <https://atlascity.io>
// This file is part of cryptowallet-api <https://github.com/cryptowallet-api>.
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

import envConfig from './config/envConfig';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from './config/config.module';
import { PriceFeedModule } from './modules/PriceFeed/price-feed.module';
import { PriceHistoryModule } from './modules/PriceHistory/price-history.module';
import { FeeEstimateModule } from './modules/FeeEstimate/fee-estimate.module';
import { AuthModule } from './modules/Auth/auth.module';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forRoot(envConfig.DB_URL, { useNewUrlParser: true }),
    AuthModule,
    PriceFeedModule,
    PriceHistoryModule,
    FeeEstimateModule,
  ],
  exports: [],
  controllers: [],
  providers: [],
})
export class AppModule {}
