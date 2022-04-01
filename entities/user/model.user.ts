import { Schema, model } from "mongoose";
import dotenv from "dotenv";
dotenv.config();

declare var process: {
  env: {
    SYS_PREFIX: string;
  };
};

export interface User {
  _id: string;
  username: string;
  password: string;
  role: "ADMIN" | "USER";
  status: "ACTIVE" | "UNACTIVE" | "DELETE";
}

const UserSchema = new Schema<User>({
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

const UserModal = model(`${process.env.SYS_PREFIX}user`, UserSchema);
export default UserModal;
