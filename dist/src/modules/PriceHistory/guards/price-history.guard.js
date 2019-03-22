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
let PriceHistoryGuard = class PriceHistoryGuard {
    constructor(configService) {
        this.configService = configService;
    }
    validateParams(params) {
        const { coin, currency, period, } = params;
        const validCoin = new RegExp('^[A-Z]{0,10}$').test(coin);
        const requestedCurrencies = params.currency.split(',');
        const validCurrency = new RegExp('^[A-Z]{0,3}$').test(currency);
        const supportedCurrencies = this.configService.get('CURRENCIES').split(',');
        const supportsCurrency = supportedCurrencies.includes(currency);
        const validPeriod = (period === 'day' || period === 'week' || period === 'month');
        return validCoin && validCurrency && supportsCurrency && validPeriod;
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
PriceHistoryGuard = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [config_service_1.ConfigService])
], PriceHistoryGuard);
exports.PriceHistoryGuard = PriceHistoryGuard;
//# sourceMappingURL=price-history.guard.js.map