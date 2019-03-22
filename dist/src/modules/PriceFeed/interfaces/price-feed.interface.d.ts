import { Document } from 'mongoose';
import { PriceFeedData } from './price-feed-data.interface';
export interface PriceFeed extends Document {
    code: string;
    timestamp: number;
    [key: string]: PriceFeedData;
}
