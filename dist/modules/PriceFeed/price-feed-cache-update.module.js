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
const js_1 = require("@bugsnag/js");
const envConfig_1 = require("../../config/envConfig");
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const price_feed_controller_1 = require("./controllers/price-feed.controller");
const price_feed_service_1 = require("./price-feed.service");
const price_feed_schema_1 = require("./schemas/price-feed.schema");
const config_service_1 = require("../../config/config.service");
const CacheUpdate_1 = require("../../abstract/CacheUpdate");
const auth_module_1 = require("../Auth/auth.module");
const bugsnagClient = js_1.default({
    apiKey: envConfig_1.default.BUGSNAG_KEY,
    logger: null,
});
let PriceFeedCacheUpdateModule = class PriceFeedCacheUpdateModule extends CacheUpdate_1.CacheUpdate {
    constructor(priceFeedService, configService) {
        super();
        this.service = priceFeedService;
        this.configService = configService;
        this.scheduleInit(this.configService.get('PRICEFEED_CRON'));
    }
    updateDocument(document, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const supportedCurrencies = this.configService.get('CURRENCIES').split(',');
                const { code } = document;
                console.log(code);
                const oldApi = new RegExp('^[A-Z]{0,10}$').test(code);
                const response = yield this.service.fetchExternalApi(code, oldApi);
                const dtoRaw = {
                    code,
                    timestamp: Math.round(+new Date() / 1000),
                };
                supportedCurrencies.forEach((currency) => {
                    const fiat = currency.toLowerCase();
                    const filtered = {
                        TOTALVOLUME24HOURTO: response.data[code][`${fiat}_24h_vol`],
                        PRICE: response.data[code][fiat],
                        CHANGEPCT24HOUR: response.data[code][`${fiat}_24h_change`],
                        MKTCAP: response.data[code][`${fiat}_market_cap`],
                    };
                    dtoRaw[currency] = filtered;
                });
                yield this.service.update({ code }, dtoRaw);
                callback(null, { code });
            }
            catch (err) {
                bugsnagClient.notify(err);
            }
        });
    }
};
PriceFeedCacheUpdateModule = __decorate([
    common_1.Module({
        imports: [
            auth_module_1.AuthModule,
            mongoose_1.MongooseModule.forFeature([{ name: 'PriceFeed', schema: price_feed_schema_1.PriceFeedSchema }]),
        ],
        exports: [],
        controllers: [price_feed_controller_1.PriceFeedController],
        providers: [price_feed_service_1.PriceFeedService],
    }),
    __metadata("design:paramtypes", [price_feed_service_1.PriceFeedService, config_service_1.ConfigService])
], PriceFeedCacheUpdateModule);
exports.PriceFeedCacheUpdateModule = PriceFeedCacheUpdateModule;
//# sourceMappingURL=price-feed-cache-update.module.js.map