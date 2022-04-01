import { Request, Response } from "express";
import { ResponseFail, ResponseSuccess } from "../core";
import UserModal, { User } from "./model.user";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { TokenInfo } from "../../auth/authUser";
dotenv.config();

declare var process: {
  env: {
    ACCESS_TOKEN_KEY: string;
  };
};

interface AuthRequest extends Request {
  tokenInfo: TokenInfo;
}

const login = async (req: Request, res: Response) => {
  try {
    interface LoginInfo {
      username: string;
      password: string;
    }

    const loginInfo: LoginInfo = req.body;

    //validate login info
    if (loginInfo.username.length < 6) {
      throw "Account or password is not correct.";
    }

    if (loginInfo.password.length === 0) {
      throw "Account or password is not correct.";
    }

    //check login
    const currentUser = await UserModal.findOne(
      {
        username: loginInfo.username,
        password: loginInfo.password,
      },
      "username status role"
    );

    if (!currentUser) {
      throw "Account or password is not correct.";
    }

    if (currentUser.status === "DELETE") {
      throw "Account is deleted.";
    }

    if (currentUser.status === "UNACTIVE") {
      throw "Account is not active.";
    }

    const accessToken = jwt.sign(
      {
        userId: currentUser._id,
        role: currentUser.role,
      },
      process.env.ACCESS_TOKEN_KEY
    );

    return res.status(200).json(<ResponseSuccess>{
      success: true,
      data: {
        user: currentUser,
        accessToken,
      },
    });
  } catch (error) {
    return res.status(400).json(<ResponseFail>{
      success: false,
      error,
    });
  }
};

const register = async (req: Request, res: Response) => {
  try {
    const requestUserInfo: User = req.body;

    //validate body request
    if (
      requestUserInfo.username.length === 0 ||
      requestUserInfo.password.length === 0
    ) {
      throw "Please check your information again.";
    }

    if (requestUserInfo.username.length < 6) {
      throw "Account must be has length > 5";
    }

    //check username existed
    const checkUser = await UserModal.findOne({
      username: requestUserInfo.username,
    });

    if (checkUser) {
      throw "Account has been registerd. Please try another one.";
    }

    //insert to db
    requestUserInfo.role = "USER";
    requestUserInfo.status = "ACTIVE";

    const newUser = new UserModal(requestUserInfo);
    newUser.save();

    newUser.password = "";

    return res.status(200).json(<ResponseSuccess>{
      success: true,
      data: newUser,
    });
  } catch (error) {
    return res.status(400).json(<ResponseFail>{
      success: false,
      error,
    });
  }
};

const getList = async (req: Request, res: Response) => {
  try {
    const userList = await UserModal.find({}, "username status role");

    return res.status(200).json(<ResponseSuccess>{
      success: true,
      data: {
        userList,
      },
    });
  } catch (error) {
    return res.status(400).json(<ResponseFail>{
      success: false,
      error,
    });
  }
};

const getUserByID = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const user = await UserModal.findOne(
      {
        _id: userId,
      },
      "username status role"
    );

    if (!user) {
      throw `Not found by userId = ${userId}`;
    }

    return res.status(200).json(<ResponseSuccess>{
      success: true,
      data: {
        user,
      },
    });
  } catch (error) {
    return res.status(400).json(<ResponseFail>{
      success: false,
      error,
    });
  }
};

const changePassword = async (req: any, res: Response) => {
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
    let user: User | null;
    try {
      user = await UserModal.findOne({
        _id: userId,
        password: oldPassword,
      });
    } catch (error) {
      throw "Please check your information again.";
    }

    if (!user) {
      throw "Please check your information again.";
    }

    await UserModal.findByIdAndUpdate(userId, {
      password: newPassword,
    });

    return res.status(200).json(<ResponseSuccess>{
      success: true,
      data: {
        message: "Change password success.",
      },
    });
  } catch (error) {
    return res.status(400).json(<ResponseFail>{
      success: false,
      error,
    });
  }
};

const UserController = {
  register,
  login,
  getList,
  getUserByID,
  changePassword,
};

export default UserController;
