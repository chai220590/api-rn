"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const UserSchema = new mongoose_1.Schema({
    username: {
        type: String,
        require: true,
        unique: true,
    },
    password: {
        type: String,
        require: true,
    },
    role: {
        type: String,
        enum: ["ADMIN", "USER"],
        default: "USER",
    },
    status: {
        type: String,
        enum: ["ACTIVE", "UNACTIVE", "DELETE"],
        default: "ACTIVE",
    },
});
const UserModal = (0, mongoose_1.model)(`${process.env.SYS_PREFIX}user`, UserSchema);
exports.default = UserModal;
