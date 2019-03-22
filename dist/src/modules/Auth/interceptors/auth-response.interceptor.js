"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const operators_1 = require("rxjs/operators");
const auth_service_1 = require("../auth.service");
const config_service_1 = require("../../../config/config.service");
let AuthResponseInterceptor = class AuthResponseInterceptor {
    constructor(authService, configService) {
        this.authService = authService;
        this.configService = configService;
    }
    intercept(context, call$) {
        return call$.pipe(operators_1.map((data) => __awaiter(this, void 0, void 0, function* () {
            const req = context.switchToHttp().getRequest();
            const accessToken = req.headers.authorization.replace('Bearer ', '');
            const decoded = yield this.authService.decodeToken(accessToken);
            const refreshTokenLifespan = parseInt(this.configService.get('REFRESH_TOKEN_LIFESPAN_SEC'), 10);
            const newRefreshToken = yield this.authService.createToken(decoded.deviceIdHash, refreshTokenLifespan);
            yield this.authService.update({ deviceIdHash: decoded.deviceIdHash }, { refreshTokens: [newRefreshToken] });
            req.res.header('new_refresh_token', newRefreshToken);
            return data;
        })));
    }
};
AuthResponseInterceptor = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        config_service_1.ConfigService])
], AuthResponseInterceptor);
exports.AuthResponseInterceptor = AuthResponseInterceptor;
//# sourceMappingURL=auth-response.interceptor.js.map