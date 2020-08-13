import { AbstractService } from '../../abstract/AbstractService';
import { Model } from 'mongoose';
import { PriceHistory } from './interfaces/price-history.interface';
import { PriceHistoryDto } from './dto/price-history.dto';
import { ConfigService } from '../../config/config.service';
export declare class PriceHistoryService extends AbstractService<PriceHistory, PriceHistoryDto> {
    protected readonly model: Model<PriceHistory>;
    private readonly configService;
    constructor(model: Model<PriceHistory>, configService: ConfigService);
    fetchExternalApi(code: string, currency: string, period: string, oldApi: boolean): Promise<any>;
    fetchCryptoCompareApi(code: string, currency: string, period: string): Promise<any>;
    fetchCoinGeckoApi(code: string, currency: string, period: string): Promise<any>;
}
