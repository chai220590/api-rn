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
  createDate: string | undefined;
  avatar: string;
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
  createDate: {
    type: Date,
    default: Date.now(),
  },
  avatar: {
    type: String,
    default:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTaK4zfz4SxPaBo6CIwLLxUZ5tby1Q_1uuuug&usqp=CAU",
  },
});

const UserModal = model(`${process.env.SYS_PREFIX}user`, UserSchema);
export default UserModal;
