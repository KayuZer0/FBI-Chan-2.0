"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
// import mongooseUniqueValidator from "mongoose-unique-validator";
const schema = new mongoose_1.default.Schema({
    server_id: { type: String, required: true, unique: true },
    default_role: { type: String, required: true, default: 'None' },
    jail_role: { type: String, required: true, default: 'None' },
});
// schema.plugin(mongooseUniqueValidator)
exports.default = mongoose_1.default.model('serverValues', schema, 'serverValues');
