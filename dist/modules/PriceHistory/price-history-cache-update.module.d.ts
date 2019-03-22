import { PriceHistoryService } from './price-history.service';
import { ConfigService } from '../../config/config.service';
import { CacheUpdate } from '../../abstract/CacheUpdate';
export declare class PriceHistoryCacheUpdateModule extends CacheUpdate {
    protected readonly service: PriceHistoryService;
    protected readonly configService: ConfigService;
    constructor(priceHistoryService: PriceHistoryService, configService: ConfigService);
    protected updateDocument(document: any, callback: any): Promise<void>;
}
