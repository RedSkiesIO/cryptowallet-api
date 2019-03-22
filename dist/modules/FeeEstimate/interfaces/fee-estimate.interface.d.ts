import { Document } from 'mongoose';
export interface FeeEstimate extends Document {
    code: string;
    timestamp: number;
    data: object;
}
