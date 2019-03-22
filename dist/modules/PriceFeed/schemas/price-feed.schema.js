"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const envConfig_1 = require("../../../config/envConfig");
const mongoose = require("mongoose");
const schemaShape = {
    timestamp: Number,
    code: String,
};
envConfig_1.default.CURRENCIES.split(',').forEach((currency) => {
    schemaShape[currency] = Object;
});
exports.PriceFeedSchema = new mongoose.Schema(schemaShape);
//# sourceMappingURL=price-feed.schema.js.map