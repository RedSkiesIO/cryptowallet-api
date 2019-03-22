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
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const fee_estimate_controller_1 = require("./controllers/fee-estimate.controller");
const fee_estimate_service_1 = require("./fee-estimate.service");
const fee_estimate_schema_1 = require("./schemas/fee-estimate.schema");
const config_service_1 = require("../../config/config.service");
const fee_estimate_cache_update_module_1 = require("./fee-estimate-cache-update.module");
let FeeEstimateModule = class FeeEstimateModule {
    constructor(configService) {
        this.configService = configService;
    }
};
FeeEstimateModule = __decorate([
    common_1.Module({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: 'FeeEstimate', schema: fee_estimate_schema_1.FeeEstimateSchema }]),
            fee_estimate_cache_update_module_1.FeeEstimateCacheUpdateModule,
        ],
        exports: [],
        controllers: [fee_estimate_controller_1.FeeEstimateController],
        providers: [fee_estimate_service_1.FeeEstimateService],
    }),
    __metadata("design:paramtypes", [config_service_1.ConfigService])
], FeeEstimateModule);
exports.FeeEstimateModule = FeeEstimateModule;
//# sourceMappingURL=fee-estimate.module.js.map