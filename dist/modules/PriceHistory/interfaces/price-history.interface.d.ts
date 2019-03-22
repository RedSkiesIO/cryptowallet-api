import { Document } from 'mongoose';
export interface PriceHistory extends Document {
    code: string;
    timestamp: number;
    currency: string;
    period: string;
    data: object;
}
