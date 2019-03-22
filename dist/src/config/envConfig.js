"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = require("dotenv");
const fs = require("fs");
const path = '.env';
let env;
if (fs.existsSync(path)) {
    env = dotenv.parse(fs.readFileSync(path));
}
env = Object.assign({}, process.env, env);
exports.default = env;
//# sourceMappingURL=envConfig.js.map