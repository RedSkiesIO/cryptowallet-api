import { ConfigService } from '../config/config.service';
export declare abstract class CacheUpdate {
    protected readonly service: any;
    protected readonly configService: ConfigService;
    protected abstract updateDocument(document: any, callback: any): void;
    protected scheduleInit(cronPattern: string): void;
    protected updateCache(): Promise<{}>;
}
