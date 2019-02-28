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
import { PriceHistory } from './interfaces/price-history.interface';
import { PriceHistoryDto } from './dto/price-history.dto';

@Injectable()
export class PriceHistoryService {
  constructor(@InjectModel('PriceHistory') private readonly priceHistoryModel: Model<PriceHistory>) {}

  async create(priceHistoryDto: PriceHistoryDto): Promise<PriceHistory> {
    const createdPriceHistory = new this.priceHistoryModel(priceHistoryDto);
    return await createdPriceHistory.save();
  }

  async findAll(exclude: object = { _id: 0, __v: 0 }): Promise<PriceHistory[]> {
    return await this.priceHistoryModel.find({}, exclude).exec();
  }

  async findOne(query: object, exclude: object = { _id: 0, __v: 0 }): Promise<PriceHistory[]> {
    return await this.priceHistoryModel.findOne(query, exclude).exec();
  }

  async delete(query: object): Promise<any> {
    return await this.priceHistoryModel.find(query).remove().exec();
  }

  async drop(): Promise<any> {
    return await this.priceHistoryModel.deleteMany({}).exec();
  }
}
