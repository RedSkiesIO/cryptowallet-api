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

export abstract class AbstractService<T, D> {
  protected readonly model: Model<T>;

  async create(dto: D): Promise<T> {
    const model = new this.model(dto);
    return await model.save();
  }

  async findOne(query: object, exclude: object = { _id: 0, __v: 0 }): Promise<Model<T>> {
    return await this.model.findOne(query, exclude).exec();
  }

  async findAll(exclude: object = { _id: 0, __v: 0 }): Promise<T[]> {
    return await this.model.find({}, exclude).exec();
  }

  async update(query: object, data: object): Promise<any> {
    return await this.model.updateOne(query, data).exec();
  }

  async delete(query: object): Promise<any> {
    return await this.model.find(query).remove().exec();
  }

  async drop(): Promise<any> {
    return await this.model.deleteMany({}).exec();
  }
}
