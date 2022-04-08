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
    createDate: {
        type: Date,
        default: Date.now(),
    },
    avatar: {
        type: String,
        default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTaK4zfz4SxPaBo6CIwLLxUZ5tby1Q_1uuuug&usqp=CAU",
    },
});
const UserModal = (0, mongoose_1.model)(`${process.env.SYS_PREFIX}user`, UserSchema);
exports.default = UserModal;
