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
Object.defineProperty(exports, "__esModule", { value: true });
const config_service_1 = require("../../../config/config.service");
const common_1 = require("@nestjs/common");
let FeeEstimateGuard = class FeeEstimateGuard {
    constructor(configService) {
        this.configService = configService;
    }
    validateParams(params) {
        const { coin } = params;
        const validCoin = new RegExp('^[A-Z]{0,10}$').test(coin);
        return validCoin;
    }
    canActivate(context) {
        const request = context.switchToHttp().getRequest();
        if (this.validateParams(request.params)) {
            return true;
        }
        else {
            throw new common_1.HttpException('Unprocessable Entity', common_1.HttpStatus.UNPROCESSABLE_ENTITY);
        }
    }
};
FeeEstimateGuard = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [config_service_1.ConfigService])
], FeeEstimateGuard);
exports.FeeEstimateGuard = FeeEstimateGuard;
//# sourceMappingURL=fee-estimate.guard.js.map