"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const model_1 = require("../models/model");
const config_1 = __importDefault(require("../config/config"));
const mongoose_1 = __importDefault(require("mongoose"));
mongoose_1.default.connect(config_1.default, (err) => {
    if (err) {
        console.log(err.message);
    }
    else {
        console.log("Database Connected Successfully!");
    }
});
let result;
test("checking role of user", () => __awaiter(void 0, void 0, void 0, function* () {
    result = yield model_1.User.findOne({ role: 1 });
    expect(result).not.toEqual(null);
}));
/*
app.listen(3000, () => {
        console.log(`[server]: Server is running at https://localhost:3000`);
    });
*/
jest.clearAllTimers();
//# sourceMappingURL=admin.test.js.map