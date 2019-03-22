import { ConfigService } from '../../../config/config.service';
import { PriceFeedService } from '../price-feed.service';
export declare class PriceFeedController {
    private readonly priceFeedService;
    private readonly configService;
    constructor(priceFeedService: PriceFeedService, configService: ConfigService);
    filterOutCurrencies(data: object, currenciesToInclude: string[]): object;
    getCoinData(code: string, requestedCurrencies: string[]): Promise<any>;
    fetchData(request: any, params: any): Promise<any>;
}
