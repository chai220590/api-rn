"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const connectDB = () => {
    (0, mongoose_1.connect)(process.env.SITE_CONNECTION_STRING, {}, (error) => {
        if (error) {
            console.log(error);
            console.log("connect db fail");
        }
        else {
            console.log("connect db success");
        }
    });
};
exports.default = connectDB;
