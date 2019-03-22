import { Document } from 'mongoose';
export interface Device extends Document {
    deviceIdHash: string;
}
