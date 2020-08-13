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
var _a;
const AbstractService_1 = require("../../abstract/AbstractService");
const mongoose_1 = require("mongoose");
const common_1 = require("@nestjs/common");
const mongoose_2 = require("@nestjs/mongoose");
const config_service_1 = require("../../config/config.service");
const CoinGecko = require('coingecko-api');
const coinGecko = new CoinGecko();
let PriceHistoryService = class PriceHistoryService extends AbstractService_1.AbstractService {
    constructor(model, configService) {
        super();
        this.model = model;
        this.configService = configService;
    }
    fetchExternalApi(code, currency, period, oldApi) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (oldApi)
                    return this.fetchCryptoCompareApi(code, currency, period);
                return this.fetchCoinGeckoApi(code, currency, period);
            }
            catch (err) {
                if (err.response) {
                    throw new Error(`External API: ${err.response.status}`);
                }
                else if (err.request) {
                    throw new Error(`External API: no response received`);
                }
                else {
                    throw new Error(err.message);
                }
            }
        });
    }
    fetchCryptoCompareApi(code, currency, period) {
        return __awaiter(this, void 0, void 0, function* () {
            let days;
            switch (period) {
                case 'day':
                    days = 1;
                    break;
                case 'week':
                    days = 7;
                    break;
                case 'month':
                    days = 30;
                    break;
                default:
                    throw new common_1.HttpException('Internal Server Error', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
            const cryptoCompareKey = this.configService.get('CRYPTO_COMPARE_KEY');
            const cryptoCompareURL = this.configService.get('CRYPTO_COMPARE_URL');
            const URL = `${cryptoCompareURL}/data/histo${histoType}?fsym=${code}&tsym=${currency}&limit=${limit}&api_key=${cryptoCompareKey}`;
            const response = yield axios_1.default.get(URL);
            if (response.status !== 200) {
                throw new common_1.HttpException(`Internal Server Error.`, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
            if (response.data.Response && response.data.Response === 'Error') {
                throw new common_1.HttpException(`Internal Server Error. ${response.Message}`, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
            return response;
        });
    }
    fetchCoinGeckoApi(code, currency, period) {
        return __awaiter(this, void 0, void 0, function* () {
            let days;
            switch (period) {
                case 'day':
                    days = 1;
                    break;
                case 'week':
                    days = 7;
                    break;
                case 'month':
                    days = 30;
                    break;
                default:
                    throw new common_1.HttpException('Internal Server Error', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
            const isERC20 = new RegExp('^0x[a-fA-F0-9]{40}$').test(code);
            const apiCall = isERC20 ? 'fetchCoinContractMarketChart' : 'fetchMarketChart';
            const params = {
                days,
                vs_currencies: currency,
            };
            const response = yield coinGecko.coins[apiCall](code.toLowerCase(), isERC20 ? 'ethereum' : params, isERC20 ? params : null);
            if (response.code !== 200) {
                throw new common_1.HttpException(`Internal Server Error.`, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
            if (!response.data || !response.data.prices) {
                throw new common_1.HttpException(`Internal Server Error. No data returned`, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
            return response.data.prices.map((price) => {
                return {
                    t: price[0],
                    y: price[1],
                };
            });
        });
    }
};
PriceHistoryService = __decorate([
    common_1.Injectable(),
    __param(0, mongoose_2.InjectModel('PriceHistory')),
    __metadata("design:paramtypes", [typeof (_a = typeof mongoose_1.Model !== "undefined" && mongoose_1.Model) === "function" ? _a : Object, config_service_1.ConfigService])
], PriceHistoryService);
exports.PriceHistoryService = PriceHistoryService;
//# sourceMappingURL=price-history.service.js.map