import { AbstractService } from '../../abstract/AbstractService';
import { Model } from 'mongoose';
import { PriceFeed } from './interfaces/price-feed.interface';
import { PriceFeedDto } from './dto/price-feed.dto';
import { ConfigService } from '../../config/config.service';
export declare class PriceFeedService extends AbstractService<PriceFeed, PriceFeedDto> {
    protected readonly model: Model<PriceFeed>;
    private readonly configService;
    constructor(model: Model<PriceFeed>, configService: ConfigService);
    fetchExternalApi(code: string, oldApi: boolean): Promise<any>;
    fetchCoinGeckoApi(code: string, supportedCurrencies: any): Promise<any>;
    fetchCryptoCompareApi(code: string, supportedCurrencies: any): Promise<any>;
}
