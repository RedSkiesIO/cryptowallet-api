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

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PriceFeedController } from './controllers/price-feed.controller';
import { PriceFeedService } from './price-feed.service';
import { PriceFeedSchema } from './schemas/price-feed.schema';
import { ConfigService } from '../../config/config.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'PriceFeed', schema: PriceFeedSchema }]),
  ],
  exports: [],
  controllers: [PriceFeedController],
  providers: [PriceFeedService],
})
export class PriceFeedModule {
  constructor(private readonly configService: ConfigService) {}
}
