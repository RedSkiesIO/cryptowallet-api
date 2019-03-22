import { NestInterceptor, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';
import { ConfigService } from '../../../config/config.service';
export declare class AuthResponseInterceptor implements NestInterceptor {
    private readonly authService;
    private readonly configService;
    constructor(authService: AuthService, configService: ConfigService);
    intercept(context: ExecutionContext, call$: Observable<any>): Observable<any>;
}
