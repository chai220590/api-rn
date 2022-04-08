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
const model_user_1 = __importDefault(require("./model.user"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const avatar_user_1 = __importDefault(require("./avatar.user"));
dotenv_1.default.config();
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const loginInfo = req.body;
        //validate login info
        if (loginInfo.username.length < 6) {
            throw "Account or password is not correct.";
        }
        if (loginInfo.password.length === 0) {
            throw "Account or password is not correct.";
        }
        //check login
        const currentUser = yield model_user_1.default.findOne({
            username: loginInfo.username,
            password: loginInfo.password,
        }, "username status role");
        if (!currentUser) {
            throw "Account or password is not correct.";
        }
        if (currentUser.status === "DELETE") {
            throw "Account is deleted.";
        }
        if (currentUser.status === "UNACTIVE") {
            throw "Account is not active.";
        }
        const accessToken = jsonwebtoken_1.default.sign({
            userId: currentUser._id,
            role: currentUser.role,
        }, process.env.ACCESS_TOKEN_KEY);
        return res.status(200).json({
            success: true,
            data: {
                user: currentUser,
                accessToken,
            },
        });
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            error,
        });
    }
});
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const requestUserInfo = req.body;
        const ranNumber = parseInt((Math.random() * avatar_user_1.default.length).toFixed()) || 0;
        const newAvatar = avatar_user_1.default[ranNumber];
        //validate body request
        if (requestUserInfo.username.length === 0 ||
            requestUserInfo.password.length === 0) {
            throw "Please check your information again.";
        }
        if (requestUserInfo.username.length < 6) {
            throw "Account must be has length > 5";
        }
        //check username existed
        const checkUser = yield model_user_1.default.findOne({
            username: requestUserInfo.username,
        });
        if (checkUser) {
            throw "Account has been registerd. Please try another one.";
        }
        //insert to db
        requestUserInfo.role = "USER";
        requestUserInfo.status = "ACTIVE";
        requestUserInfo.avatar = newAvatar;
        const newUser = new model_user_1.default(requestUserInfo);
        newUser.save();
        return res.status(200).json({
            success: true,
            data: newUser,
        });
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            error,
        });
    }
});
const getList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userList = yield model_user_1.default.find({}, "username status role avatar createDate", {
            sort: {
                createDate: -1,
            },
        });
        return res.status(200).json({
            success: true,
            data: {
                userList,
            },
        });
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            error,
        });
    }
});
const getUserByID = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const user = yield model_user_1.default.findOne({
            _id: userId,
        }, "username status role avatar createDate");
        if (!user) {
            throw `Not found by userId = ${userId}`;
        }
        return res.status(200).json({
            success: true,
            data: {
                user,
            },
        });
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            error,
        });
    }
});
const changePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, oldPassword, newPassword } = req.body;
        if (userId != req.tokenInfo.userId) {
            throw "Permission denied.";
        }
        if (oldPassword == newPassword) {
            throw "Please enter a different password than the old password.";
        }
        if (oldPassword.length === 0 || newPassword.length === 0) {
            throw "Please check your information again.";
        }
        let user;
        try {
            user = yield model_user_1.default.findOne({
                _id: userId,
                password: oldPassword,
            });
        }
        catch (error) {
            throw "Please check your information again.";
        }
        if (!user) {
            throw "Please check your information again.";
        }
        yield model_user_1.default.findByIdAndUpdate(userId, {
            password: newPassword,
        });
        return res.status(200).json({
            success: true,
            data: {
                message: "Change password success.",
            },
        });
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            error,
        });
    }
});
const deleteById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        yield model_user_1.default.deleteOne({
            _id: userId,
        });
        return res.status(200).json({
            success: true,
            data: null,
            message: "Delete user success",
        });
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            error,
        });
    }
});
const UserController = {
    register,
    login,
    getList,
    getUserByID,
    changePassword,
    deleteById,
};
exports.default = UserController;
