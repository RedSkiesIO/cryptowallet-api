"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = require("dotenv");
const fs = require("fs");
class ConfigService {
    constructor(filePath) {
        let env;
        if (fs.existsSync(filePath)) {
            env = dotenv.parse(fs.readFileSync(filePath));
        }
        this.envConfig = Object.assign({}, process.env, env);
    }
    get(key) {
        return this.envConfig[key];
    }
}
exports.ConfigService = ConfigService;
//# sourceMappingURL=config.service.js.map