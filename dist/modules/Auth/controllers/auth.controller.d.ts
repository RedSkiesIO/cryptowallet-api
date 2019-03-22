import { AuthService } from '../auth.service';
import { ConfigService } from '../../../config/config.service';
export declare class AuthController {
    private readonly authService;
    private readonly configService;
    constructor(authService: AuthService, configService: ConfigService);
    createToken(request: any, params: any): Promise<any>;
    refreshToken(body: any): Promise<any>;
}
