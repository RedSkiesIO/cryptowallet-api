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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
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
const js_1 = require("@bugsnag/js");
const envConfig_1 = require("../../../config/envConfig");
const common_1 = require("@nestjs/common");
const config_service_1 = require("../../../config/config.service");
const price_feed_service_1 = require("../price-feed.service");
const price_feed_dto_1 = require("../dto/price-feed.dto");
const price_feed_guard_1 = require("../guards/price-feed.guard");
const price_feed_data_interface_1 = require("../interfaces/price-feed-data.interface");
const jwt_auth_guard_1 = require("../../Auth/guards/jwt-auth.guard");
const auth_response_interceptor_1 = require("../../Auth/interceptors/auth-response.interceptor");
const bugsnagClient = js_1.default({
    apiKey: envConfig_1.default.BUGSNAG_KEY,
    logger: null,
});
let PriceFeedController = class PriceFeedController {
    constructor(priceFeedService, configService) {
        this.priceFeedService = priceFeedService;
        this.configService = configService;
    }
    filterOutCurrencies(data, currenciesToInclude) {
        for (const key in data) {
            if (key !== 'code' && key !== 'timestamp') {
                if (!currenciesToInclude.includes(key)) {
                    delete data[key];
                }
            }
        }
        return data;
    }
    getCoinData(code, requestedCurrencies) {
        return __awaiter(this, void 0, void 0, function* () {
            const supportedCurrencies = this.configService.get('CURRENCIES').split(',');
            const excludeCurrencies = { _id: 0, __v: 0 };
            if (requestedCurrencies[0] !== 'ALL') {
                supportedCurrencies.forEach((currency) => {
                    if (!requestedCurrencies.includes(currency)) {
                        excludeCurrencies[currency] = 0;
                    }
                });
            }
            const result = yield this.priceFeedService.findOne({ code }, excludeCurrencies);
            if (result) {
                return result;
            }
            const response = yield this.priceFeedService.fetchExternalApi(code);
            const timestamp = Math.round(+new Date() / 1000);
            const dtoRaw = {
                code,
                timestamp,
            };
            supportedCurrencies.forEach((currency) => {
                const filtered = {};
                price_feed_data_interface_1.PriceFeedDataInterfaceKeys.forEach((key) => {
                    filtered[key] = response.data.RAW[code][currency][key];
                });
                dtoRaw[currency] = filtered;
            });
            const dto = new price_feed_dto_1.PriceFeedDto(dtoRaw);
            yield this.priceFeedService.create(dto);
            if (requestedCurrencies[0] === 'ALL') {
                return dto;
            }
            return this.filterOutCurrencies(dto, requestedCurrencies);
        });
    }
    fetchData(request, params) {
        return __awaiter(this, void 0, void 0, function* () {
            const supportedCurrencies = this.configService.get('CURRENCIES').split(',');
            const requestedCoins = params.coin.split(',');
            const requestedCurrencies = params.currency.split(',');
            const promises = requestedCoins.map((coin) => {
                return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                    try {
                        const coinData = yield this.getCoinData(coin, requestedCurrencies);
                        resolve(coinData);
                    }
                    catch (err) {
                        reject(err);
                    }
                }));
            });
            try {
                return yield Promise.all(promises);
            }
            catch (err) {
                bugsnagClient.notify(err);
                throw new common_1.HttpException(`Internal Server Error. ${err.message}`, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
        });
    }
};
__decorate([
    common_1.Get(':coin/:currency'),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    common_1.UseInterceptors(auth_response_interceptor_1.AuthResponseInterceptor),
    __param(0, common_1.Req()), __param(1, common_1.Param()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PriceFeedController.prototype, "fetchData", null);
PriceFeedController = __decorate([
    common_1.Controller('price-feed'),
    common_1.UseGuards(price_feed_guard_1.PriceFeedGuard),
    __metadata("design:paramtypes", [price_feed_service_1.PriceFeedService, config_service_1.ConfigService])
], PriceFeedController);
exports.PriceFeedController = PriceFeedController;
//# sourceMappingURL=price-feed.controller.js.map