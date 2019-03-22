"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const schemaShape = {
    deviceIdHash: String,
    refreshTokens: Array,
};
exports.DeviceSchema = new mongoose.Schema(schemaShape);
//# sourceMappingURL=device.schema.js.map