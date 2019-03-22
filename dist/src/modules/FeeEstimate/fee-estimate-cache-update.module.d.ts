import { FeeEstimateService } from './fee-estimate.service';
import { ConfigService } from '../../config/config.service';
import { CacheUpdate } from '../../abstract/CacheUpdate';
export declare class FeeEstimateCacheUpdateModule extends CacheUpdate {
    protected readonly service: FeeEstimateService;
    protected readonly configService: ConfigService;
    constructor(feeEstimateService: FeeEstimateService, configService: ConfigService);
    protected updateDocument(document: any, callback: any): Promise<void>;
}
