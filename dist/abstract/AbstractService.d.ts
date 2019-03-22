import { Model } from 'mongoose';
export declare abstract class AbstractService<T, D> {
    protected readonly model: Model<T>;
    create(dto: D): Promise<T>;
    findOne(query: object, exclude?: object): Promise<Model<T>>;
    findAll(exclude?: object): Promise<T[]>;
    update(query: object, data: object): Promise<any>;
    delete(query: object): Promise<any>;
    drop(): Promise<any>;
}
