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
Object.defineProperty(exports, "__esModule", { value: true });
const envConfig_1 = require("./config/envConfig");
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const config_module_1 = require("./config/config.module");
const price_feed_module_1 = require("./modules/PriceFeed/price-feed.module");
const price_history_module_1 = require("./modules/PriceHistory/price-history.module");
const fee_estimate_module_1 = require("./modules/FeeEstimate/fee-estimate.module");
const auth_module_1 = require("./modules/Auth/auth.module");
let AppModule = class AppModule {
};
AppModule = __decorate([
    common_1.Module({
        imports: [
            config_module_1.ConfigModule,
            mongoose_1.MongooseModule.forRoot(envConfig_1.default.DB_URL, { useNewUrlParser: true }),
            auth_module_1.AuthModule,
            price_feed_module_1.PriceFeedModule,
            price_history_module_1.PriceHistoryModule,
            fee_estimate_module_1.FeeEstimateModule,
        ],
        exports: [],
        controllers: [],
        providers: [],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map