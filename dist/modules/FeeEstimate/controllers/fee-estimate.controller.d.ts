import { ConfigService } from '../../../config/config.service';
import { FeeEstimateService } from '../fee-estimate.service';
export declare class FeeEstimateController {
    private readonly feeEstimateService;
    private readonly configService;
    constructor(feeEstimateService: FeeEstimateService, configService: ConfigService);
    getCoinData(code: string): Promise<any>;
    fetchData(request: any, params: any): Promise<any>;
}
