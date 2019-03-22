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
class AbstractService {
    create(dto) {
        return __awaiter(this, void 0, void 0, function* () {
            const model = new this.model(dto);
            return yield model.save();
        });
    }
    findOne(query, exclude = { _id: 0, __v: 0 }) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.model.findOne(query, exclude).exec();
        });
    }
    findAll(exclude = { _id: 0, __v: 0 }) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.model.find({}, exclude).exec();
        });
    }
    update(query, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.model.updateOne(query, data).exec();
        });
    }
    delete(query) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.model.find(query).remove().exec();
        });
    }
    drop() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.model.deleteMany({}).exec();
        });
    }
}
exports.AbstractService = AbstractService;
//# sourceMappingURL=AbstractService.js.map