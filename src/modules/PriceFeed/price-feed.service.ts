// Copyright (C) Atlas City Global <https://atlascity.io>
// This file is part cryptowallet-api <https://github.com/atlascity/cryptowallet-api>.
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

import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PriceFeed } from './interfaces/price-feed.interface';
import { PriceFeedDto } from './dto/price-feed.dto';

@Injectable()
export class PriceFeedService {
  constructor(@InjectModel('PriceFeed') private readonly priceFeedModel: Model<PriceFeed>) {}

  async create(priceFeedDto: PriceFeedDto): Promise<PriceFeed> {
    const createdPriceFeed = new this.priceFeedModel(priceFeedDto);
    return await createdPriceFeed.save();
  }

  async findAll(exclude: object = { _id: 0, __v: 0 }): Promise<PriceFeed[]> {
    return await this.priceFeedModel.find({}, exclude).exec();
  }

  async findOne(query: object, exclude: object = { _id: 0, __v: 0 }): Promise<PriceFeed[]> {
    return await this.priceFeedModel.findOne(query, exclude).exec();
  }

  async delete(query: object): Promise<any> {
    return await this.priceFeedModel.find(query).remove().exec();
  }

  async drop(): Promise<any> {
    return await this.priceFeedModel.deleteMany({}).exec();
  }
}
