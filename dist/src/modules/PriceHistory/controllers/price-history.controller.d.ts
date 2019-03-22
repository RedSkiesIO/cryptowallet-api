import { ConfigService } from '../../../config/config.service';
import { PriceHistoryService } from '../price-history.service';
export declare class PriceHistoryController {
    private readonly priceHistoryService;
    private readonly configService;
    constructor(priceHistoryService: PriceHistoryService, configService: ConfigService);
    getCoinData(code: string, currency: string, period: string): Promise<any>;
    fetchData(request: any, params: any): Promise<any>;
}
