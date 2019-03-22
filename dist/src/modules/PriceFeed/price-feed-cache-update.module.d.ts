import { PriceFeedService } from './price-feed.service';
import { ConfigService } from '../../config/config.service';
import { CacheUpdate } from '../../abstract/CacheUpdate';
export declare class PriceFeedCacheUpdateModule extends CacheUpdate {
    protected readonly service: PriceFeedService;
    protected readonly configService: ConfigService;
    constructor(priceFeedService: PriceFeedService, configService: ConfigService);
    protected updateDocument(document: any, callback: any): Promise<void>;
}
