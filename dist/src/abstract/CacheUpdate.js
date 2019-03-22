"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const schedule = require("node-schedule");
const async_1 = require("async");
class CacheUpdate {
    scheduleInit(cronPattern) {
        schedule.scheduleJob(cronPattern, () => {
            this.updateCache();
        });
    }
    updateCache() {
        return __awaiter(this, void 0, void 0, function* () {
            const documents = yield this.service.findAll();
            const operations = [];
            documents.forEach((document) => {
                operations.push((callback) => this.updateDocument(document, callback));
            });
            return new Promise((resolve) => {
                async_1.series(operations, (err) => {
                    if (err) {
                    }
                    resolve();
                });
            });
        });
    }
}
exports.CacheUpdate = CacheUpdate;
//# sourceMappingURL=CacheUpdate.js.map