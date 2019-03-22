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
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const price_feed_controller_1 = require("./controllers/price-feed.controller");
const price_feed_service_1 = require("./price-feed.service");
const price_feed_schema_1 = require("./schemas/price-feed.schema");
const config_service_1 = require("../../config/config.service");
const price_feed_cache_update_module_1 = require("./price-feed-cache-update.module");
let PriceFeedModule = class PriceFeedModule {
    constructor(configService) {
        this.configService = configService;
    }
};
PriceFeedModule = __decorate([
    common_1.Module({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: 'PriceFeed', schema: price_feed_schema_1.PriceFeedSchema }]),
            price_feed_cache_update_module_1.PriceFeedCacheUpdateModule,
        ],
        exports: [],
        controllers: [price_feed_controller_1.PriceFeedController],
        providers: [price_feed_service_1.PriceFeedService],
    }),
    __metadata("design:paramtypes", [config_service_1.ConfigService])
], PriceFeedModule);
exports.PriceFeedModule = PriceFeedModule;
//# sourceMappingURL=price-feed.module.js.map