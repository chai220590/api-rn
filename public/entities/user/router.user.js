"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authUser_1 = __importDefault(require("../../auth/authUser"));
const controller_user_1 = __importDefault(require("./controller.user"));
const UserRouter = (0, express_1.Router)();
UserRouter.post("/register", controller_user_1.default.register);
UserRouter.post("/login", controller_user_1.default.login);
UserRouter.get("/", controller_user_1.default.getList);
UserRouter.get("/:userId", controller_user_1.default.getUserByID);
UserRouter.put("/changePassword", authUser_1.default, controller_user_1.default.changePassword);
exports.default = UserRouter;
