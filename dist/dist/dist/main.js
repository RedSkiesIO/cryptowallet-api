"use strict";
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
const envConfig_1 = require("./config/envConfig");
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const bugsnagClient = js_1.default({
    apiKey: envConfig_1.default.BUGSNAG_KEY,
    logger: null,
});
function bootstrap() {
    return __awaiter(this, void 0, void 0, function* () {
        const app = yield core_1.NestFactory.create(app_module_1.AppModule);
        app.enableCors({ exposedHeaders: ['new_refresh_token'] });
        yield app.listen(parseInt(envConfig_1.default.PORT, 10));
    });
}
bootstrap();
process
    .on('unhandledRejection', (err) => {
    bugsnagClient.notify(err);
})
    .on('uncaughtException', err => {
    bugsnagClient.notify(err);
});
//# sourceMappingURL=main.js.map