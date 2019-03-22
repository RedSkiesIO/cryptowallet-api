"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const envConfig_1 = require("../../../config/envConfig");
class PriceFeedDto {
    constructor(payload) {
        this.code = payload.code;
        this.timestamp = payload.timestamp;
        envConfig_1.default.CURRENCIES.split(',').forEach((currency) => {
            this[currency] = payload[currency];
        });
    }
}
exports.PriceFeedDto = PriceFeedDto;
//# sourceMappingURL=price-feed.dto.js.map