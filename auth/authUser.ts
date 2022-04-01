import dotenv from "dotenv";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { ResponseFail } from "../entities/core";
dotenv.config();

export interface TokenInfo {
  userId: string;
  role: string;
}

declare var process: {
  env: {
    ACCESS_TOKEN_KEY: string;
  };
};

const authUser = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(403).json(<ResponseFail>{
        success: false,
        error: "A token is required for authentication",
      });
    }
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_KEY);
    // req.tokenInfo = decoded;
  } catch (err) {
    return res.status(401).json(<ResponseFail>{
      success: false,
      error: "Invalid token.",
    });
  }
  return next();
};
export default authUser;
