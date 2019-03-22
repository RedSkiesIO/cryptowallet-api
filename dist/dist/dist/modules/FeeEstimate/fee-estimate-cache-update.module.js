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
const fee_estimate_controller_1 = require("./controllers/fee-estimate.controller");
const fee_estimate_service_1 = require("./fee-estimate.service");
const fee_estimate_schema_1 = require("./schemas/fee-estimate.schema");
const config_service_1 = require("../../config/config.service");
const CacheUpdate_1 = require("../../abstract/CacheUpdate");
const auth_module_1 = require("../Auth/auth.module");
const bugsnagClient = js_1.default({
    apiKey: envConfig_1.default.BUGSNAG_KEY,
    logger: null,
});
let FeeEstimateCacheUpdateModule = class FeeEstimateCacheUpdateModule extends CacheUpdate_1.CacheUpdate {
    constructor(feeEstimateService, configService) {
        super();
        this.service = feeEstimateService;
        this.configService = configService;
        this.scheduleInit(this.configService.get('FEEESTIMATE_CRON'));
    }
    updateDocument(document, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { code } = document;
                const freshData = yield this.service.fetchExternalApi(code);
                yield this.service.update({ code }, { data: freshData, timestamp: Math.round(+new Date() / 1000) });
                callback(null, { code });
            }
            catch (err) {
                bugsnagClient.notify(err);
            }
        });
    }
};
FeeEstimateCacheUpdateModule = __decorate([
    common_1.Module({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: 'FeeEstimate', schema: fee_estimate_schema_1.FeeEstimateSchema }]),
            auth_module_1.AuthModule,
        ],
        exports: [],
        controllers: [fee_estimate_controller_1.FeeEstimateController],
        providers: [fee_estimate_service_1.FeeEstimateService],
    }),
    __metadata("design:paramtypes", [fee_estimate_service_1.FeeEstimateService, config_service_1.ConfigService])
], FeeEstimateCacheUpdateModule);
exports.FeeEstimateCacheUpdateModule = FeeEstimateCacheUpdateModule;
//# sourceMappingURL=fee-estimate-cache-update.module.js.map