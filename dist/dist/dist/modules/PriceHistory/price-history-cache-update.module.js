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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) {
            try {
                step(generator.next(value));
            }
            catch (e) {
                reject(e);
            }
        }
        function rejected(value) {
            try {
                step(generator["throw"](value));
            }
            catch (e) {
                reject(e);
            }
        }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const js_1 = require("@bugsnag/js");
const envConfig_1 = require("../../config/envConfig");
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const price_history_controller_1 = require("./controllers/price-history.controller");
const price_history_service_1 = require("./price-history.service");
const price_history_schema_1 = require("./schemas/price-history.schema");
const config_service_1 = require("../../config/config.service");
const CacheUpdate_1 = require("../../abstract/CacheUpdate");
const auth_module_1 = require("../Auth/auth.module");
const bugsnagClient = js_1.default({
    apiKey: envConfig_1.default.BUGSNAG_KEY,
    logger: null,
});
let PriceHistoryCacheUpdateModule = class PriceHistoryCacheUpdateModule extends CacheUpdate_1.CacheUpdate {
    constructor(priceHistoryService, configService) {
        super();
        this.service = priceHistoryService;
        this.configService = configService;
        this.scheduleInit(this.configService.get('PRICEHISTORY_CRON'));
    }
    updateDocument(document, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { code, currency, period, } = document;
                const freshData = yield this.service.fetchExternalApi(code, currency, period);
                yield this.service.update({ code, currency, period }, { data: freshData.data.Data, timestamp: Math.round(+new Date() / 1000) });
                callback(null, { code, currency, period });
            }
            catch (err) {
                bugsnagClient.notify(err);
            }
        });
    }
};
PriceHistoryCacheUpdateModule = __decorate([
    common_1.Module({
        imports: [
            auth_module_1.AuthModule,
            mongoose_1.MongooseModule.forFeature([{ name: 'PriceHistory', schema: price_history_schema_1.PriceHistorySchema }]),
        ],
        exports: [],
        controllers: [price_history_controller_1.PriceHistoryController],
        providers: [price_history_service_1.PriceHistoryService],
    }),
    __metadata("design:paramtypes", [price_history_service_1.PriceHistoryService, config_service_1.ConfigService])
], PriceHistoryCacheUpdateModule);
exports.PriceHistoryCacheUpdateModule = PriceHistoryCacheUpdateModule;
//# sourceMappingURL=price-history-cache-update.module.js.map