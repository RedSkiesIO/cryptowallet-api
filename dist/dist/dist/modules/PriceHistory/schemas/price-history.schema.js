"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const schemaShape = {
    code: String,
    timestamp: Number,
    currency: String,
    period: String,
    data: Object,
};
exports.PriceHistorySchema = new mongoose.Schema(schemaShape);
//# sourceMappingURL=price-history.schema.js.map