"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class PriceHistoryDto {
    constructor(payload) {
        this.code = payload.code;
        this.timestamp = payload.timestamp;
        this.currency = payload.currency;
        this.period = payload.period;
        this.data = payload.data;
    }
}
exports.PriceHistoryDto = PriceHistoryDto;
//# sourceMappingURL=price-history.dto.js.map