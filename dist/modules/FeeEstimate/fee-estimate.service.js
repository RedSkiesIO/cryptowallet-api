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
const axios_1 = require("axios");
const AbstractService_1 = require("../../abstract/AbstractService");
const mongoose_1 = require("mongoose");
const common_1 = require("@nestjs/common");
const mongoose_2 = require("@nestjs/mongoose");
const config_service_1 = require("../../config/config.service");
let FeeEstimateService = class FeeEstimateService extends AbstractService_1.AbstractService {
    constructor(model, configService) {
        super();
        this.model = model;
        this.configService = configService;
    }
    fetchExternalApi(code) {
        return __awaiter(this, void 0, void 0, function* () {
            const supportedCodes = ['btc', 'ltc', 'dash'];
            try {
                if (code.toLowerCase() === 'eth') {
                    const response = yield axios_1.default.get(this.configService.get('ETHGASSTATION_URL'));
                    const gweiToWei = (val) => {
                        return val * (Math.pow(10, 9));
                    };
                    if (response.status !== 200) {
                        let error = response.error;
                        if (!error) {
                            error = response.body;
                        }
                        throw new common_1.HttpException(`Internal Server Error. ${error}`, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
                    }
                    return {
                        high: gweiToWei((response.data.fast / 10) * 1.1),
                        medium: gweiToWei((response.data.average / 10) * 1.1),
                        low: gweiToWei((response.data.safeLow / 10) * 1.1)
                    };
                }
                else if (supportedCodes.includes(code.toLowerCase())) {
                    const blockcypherToken = this.configService.get('BLOCKCYPHER_TOKEN');
                    const blockcypherURL = this.configService.get('BLOCKCYPHER_URL');
                    const URL = `${blockcypherURL}/v1/${code.toLowerCase()}/main?token=${blockcypherToken}`;
                    const response = yield axios_1.default.get(URL);
                    if (response.status !== 200) {
                        let error = response.error;
                        if (!error) {
                            error = response.body;
                        }
                        throw new common_1.HttpException(`Internal Server Error. ${error}`, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
                    }
                    const data = {
                        high: response.data.high_fee_per_kb,
                        medium: response.data.medium_fee_per_kb,
                        low: response.data.low_fee_per_kb,
                    };
                    if (code === 'ETH') {
                        data.high = response.data.high_gas_price;
                        data.medium = response.data.medium_gas_price;
                        data.low = response.data.low_gas_price;
                    }
                    return data;
                }
                return {
                    high: 10000000000,
                    medium: 5000000000,
                    low: 1000000000,
                };
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
FeeEstimateService = __decorate([
    common_1.Injectable(),
    __param(0, mongoose_2.InjectModel('FeeEstimate')),
    __metadata("design:paramtypes", [typeof (_a = typeof mongoose_1.Model !== "undefined" && mongoose_1.Model) === "function" ? _a : Object, config_service_1.ConfigService])
], FeeEstimateService);
exports.FeeEstimateService = FeeEstimateService;
//# sourceMappingURL=fee-estimate.service.js.map