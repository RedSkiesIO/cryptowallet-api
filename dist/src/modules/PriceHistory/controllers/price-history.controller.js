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
const price_history_service_1 = require("../price-history.service");
const price_history_dto_1 = require("../dto/price-history.dto");
const price_history_guard_1 = require("../guards/price-history.guard");
const jwt_auth_guard_1 = require("../../Auth/guards/jwt-auth.guard");
const auth_response_interceptor_1 = require("../../Auth/interceptors/auth-response.interceptor");
const bugsnagClient = js_1.default({
    apiKey: envConfig_1.default.BUGSNAG_KEY,
    logger: null,
});
let PriceHistoryController = class PriceHistoryController {
    constructor(priceHistoryService, configService) {
        this.priceHistoryService = priceHistoryService;
        this.configService = configService;
    }
    getCoinData(code, currency, period) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.priceHistoryService.findOne({ code, currency, period });
            if (result) {
                return result;
            }
            const response = yield this.priceHistoryService.fetchExternalApi(code, currency, period);
            const dto = new price_history_dto_1.PriceHistoryDto({
                code,
                currency,
                period,
                data: response.data.Data,
                timestamp: Math.round(+new Date() / 1000),
            });
            yield this.priceHistoryService.create(dto);
            return dto;
        });
    }
    fetchData(request, params) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.getCoinData(params.coin, params.currency, params.period);
            }
            catch (err) {
                bugsnagClient.notify(err);
                throw new common_1.HttpException(`Internal Server Error. ${err.message}`, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
        });
    }
};
__decorate([
    common_1.Get(':coin/:currency/:period'),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    common_1.UseInterceptors(auth_response_interceptor_1.AuthResponseInterceptor),
    __param(0, common_1.Req()), __param(1, common_1.Param()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PriceHistoryController.prototype, "fetchData", null);
PriceHistoryController = __decorate([
    common_1.Controller('price-history'),
    common_1.UseGuards(price_history_guard_1.PriceHistoryGuard),
    __metadata("design:paramtypes", [price_history_service_1.PriceHistoryService, config_service_1.ConfigService])
], PriceHistoryController);
exports.PriceHistoryController = PriceHistoryController;
//# sourceMappingURL=price-history.controller.js.map