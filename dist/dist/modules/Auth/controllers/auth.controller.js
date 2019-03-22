"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
        r = Reflect.decorate(decorators, target, key, desc);
    else
        for (var i = decorators.length - 1; i >= 0; i--)
            if (d = decorators[i])
                r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function")
        return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); };
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try {
            step(generator.next(value));
        }
        catch (e) {
            reject(e);
        } }
        function rejected(value) { try {
            step(generator["throw"](value));
        }
        catch (e) {
            reject(e);
        } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const auth_service_1 = require("../auth.service");
const device_dto_1 = require("../dto/device.dto");
const config_service_1 = require("../../../config/config.service");
let AuthController = class AuthController {
    constructor(authService, configService) {
        this.authService = authService;
        this.configService = configService;
    }
    createToken(request, params) {
        return __awaiter(this, void 0, void 0, function* () {
            const { deviceIdHash } = params;
            const device = yield this.authService.findOne({ deviceIdHash });
            const accessTokenLifespan = parseInt(this.configService.get('ACCESS_TOKEN_LIFESPAN_SEC'), 10);
            const refreshTokenLifespan = parseInt(this.configService.get('REFRESH_TOKEN_LIFESPAN_SEC'), 10);
            const accessToken = yield this.authService.createToken(deviceIdHash, accessTokenLifespan);
            const refreshToken = yield this.authService.createToken(deviceIdHash, refreshTokenLifespan);
            if (!device) {
                const dto = new device_dto_1.DeviceDto({
                    deviceIdHash,
                    refreshTokens: [refreshToken],
                });
                yield this.authService.create(dto);
            }
            else {
                yield this.authService.update({ deviceIdHash }, { refreshTokens: [refreshToken] });
            }
            return { accessToken, refreshToken };
        });
    }
    refreshToken(body) {
        return __awaiter(this, void 0, void 0, function* () {
            const decoded = yield this.authService.decodeToken(body.refresh_token);
            const currentTime = new Date().getTime() / 1000;
            if (currentTime > decoded.exp) {
                throw new common_1.HttpException('Unauthorized', common_1.HttpStatus.UNAUTHORIZED);
            }
            const deviceIdHash = decoded.deviceIdHash;
            const device = yield this.authService.findOne({ deviceIdHash });
            if (!device) {
                throw new common_1.HttpException('Unauthorized', common_1.HttpStatus.UNAUTHORIZED);
            }
            if (device.refreshTokens.includes(body.refresh_token)) {
                const accessTokenLifespan = parseInt(this.configService.get('ACCESS_TOKEN_LIFESPAN_SEC'), 10);
                const refreshTokenLifespan = parseInt(this.configService.get('REFRESH_TOKEN_LIFESPAN_SEC'), 10);
                const accessToken = yield this.authService.createToken(deviceIdHash, accessTokenLifespan);
                const refreshToken = yield this.authService.createToken(deviceIdHash, refreshTokenLifespan);
                yield this.authService.update({ deviceIdHash }, { refreshTokens: [refreshToken] });
                return { accessToken, refreshToken };
            }
            throw new common_1.HttpException('Unauthorized', common_1.HttpStatus.UNAUTHORIZED);
        });
    }
};
__decorate([
    common_1.Get('token/:deviceIdHash'),
    __param(0, common_1.Req()), __param(1, common_1.Param()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "createToken", null);
__decorate([
    common_1.Post('refresh'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refreshToken", null);
AuthController = __decorate([
    common_1.Controller('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        config_service_1.ConfigService])
], AuthController);
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map