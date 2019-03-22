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
const price_history_controller_1 = require("./controllers/price-history.controller");
const price_history_service_1 = require("./price-history.service");
const price_history_schema_1 = require("./schemas/price-history.schema");
const config_service_1 = require("../../config/config.service");
const price_history_cache_update_module_1 = require("./price-history-cache-update.module");
let PriceHistoryModule = class PriceHistoryModule {
    constructor(configService) {
        this.configService = configService;
    }
};
PriceHistoryModule = __decorate([
    common_1.Module({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: 'PriceHistory', schema: price_history_schema_1.PriceHistorySchema }]),
            price_history_cache_update_module_1.PriceHistoryCacheUpdateModule,
        ],
        exports: [],
        controllers: [price_history_controller_1.PriceHistoryController],
        providers: [price_history_service_1.PriceHistoryService],
    }),
    __metadata("design:paramtypes", [config_service_1.ConfigService])
], PriceHistoryModule);
exports.PriceHistoryModule = PriceHistoryModule;
//# sourceMappingURL=price-history.module.js.map