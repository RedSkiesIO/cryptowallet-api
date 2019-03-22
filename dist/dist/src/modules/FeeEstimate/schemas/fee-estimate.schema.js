"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const schemaShape = {
    code: String,
    timestamp: Number,
    data: Object,
};
exports.FeeEstimateSchema = new mongoose.Schema(schemaShape);
//# sourceMappingURL=fee-estimate.schema.js.map