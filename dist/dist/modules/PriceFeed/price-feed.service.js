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
var _a;
const axios_1 = require("axios");
const AbstractService_1 = require("../../abstract/AbstractService");
const mongoose_1 = require("mongoose");
const common_1 = require("@nestjs/common");
const mongoose_2 = require("@nestjs/mongoose");
const config_service_1 = require("../../config/config.service");
let PriceFeedService = class PriceFeedService extends AbstractService_1.AbstractService {
    constructor(model, configService) {
        super();
        this.model = model;
        this.configService = configService;
    }
    fetchExternalApi(code) {
        return __awaiter(this, void 0, void 0, function* () {
            const supportedCurrencies = this.configService.get('CURRENCIES').split(',');
            const cryptoCompareKey = this.configService.get('CRYPTO_COMPARE_KEY');
            const cryptoCompareURL = this.configService.get('CRYPTO_COMPARE_URL');
            const URL = `${cryptoCompareURL}/data/pricemultifull?fsyms=${code}&tsyms=${supportedCurrencies}&api_key=${cryptoCompareKey}`;
            try {
                const response = yield axios_1.default.get(URL);
                if (response.status !== 200) {
                    throw new common_1.HttpException(`Internal Server Error.`, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
                }
                if (response.data.Response && response.data.Response === 'Error') {
                    throw new common_1.HttpException(`Internal Server Error. ${response.Message}`, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
                }
                return response;
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
};
PriceFeedService = __decorate([
    common_1.Injectable(),
    __param(0, mongoose_2.InjectModel('PriceFeed')),
    __metadata("design:paramtypes", [typeof (_a = typeof mongoose_1.Model !== "undefined" && mongoose_1.Model) === "function" ? _a : Object, config_service_1.ConfigService])
], PriceFeedService);
exports.PriceFeedService = PriceFeedService;
//# sourceMappingURL=price-feed.service.js.map