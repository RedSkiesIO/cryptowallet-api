import { ConfigService } from '../../../config/config.service';
import { CanActivate, ExecutionContext } from '@nestjs/common';
interface Params {
    coin: string;
    currency: string;
}
export declare class PriceFeedGuard implements CanActivate {
    private readonly configService;
    constructor(configService: ConfigService);
    validateParams(params: Params): boolean;
    canActivate(context: ExecutionContext): boolean | Promise<boolean>;
}
export {};
