"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
// import mongooseUniqueValidator from "mongoose-unique-validator";
const schema = new mongoose_1.default.Schema({
    user_id: { type: String, required: true, unique: true },
    is_officer: { type: Boolean, required: true, default: false },
    wanted_lvl: { type: Number, required: true, default: 0 },
    wanted_reason: { type: String, required: true, default: ' ' },
    release_time: { type: Number, required: true, default: 0 }
});
// schema.plugin(mongooseUniqueValidator)
exports.default = mongoose_1.default.model('users', schema, 'users');
