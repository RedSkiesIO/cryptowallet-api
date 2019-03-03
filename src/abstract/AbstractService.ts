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

  async delete(query: object): Promise<any> {
    return await this.model.find(query).remove().exec();
  }

  async drop(): Promise<any> {
    return await this.model.deleteMany({}).exec();
  }
}
