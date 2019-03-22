import { Document } from 'mongoose';
export interface PriceFeed extends Document {
    code: string;
    timestamp: number;
}
