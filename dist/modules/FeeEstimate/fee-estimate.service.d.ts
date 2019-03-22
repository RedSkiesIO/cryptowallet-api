import { AbstractService } from '../../abstract/AbstractService';
import { Model } from 'mongoose';
import { FeeEstimate } from './interfaces/fee-estimate.interface';
import { FeeEstimateDto } from './dto/fee-estimate.dto';
import { ConfigService } from '../../config/config.service';
export declare class FeeEstimateService extends AbstractService<FeeEstimate, FeeEstimateDto> {
    protected readonly model: Model<FeeEstimate>;
    private readonly configService;
    constructor(model: Model<FeeEstimate>, configService: ConfigService);
    fetchExternalApi(code: string): Promise<any>;
}
