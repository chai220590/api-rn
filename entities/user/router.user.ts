import { Router } from "express";
import authUser from "../../auth/authUser";
import UserController from "./controller.user";

const UserRouter = Router();

UserRouter.post("/register", UserController.register);
UserRouter.post("/login", UserController.login);
UserRouter.get("/", UserController.getList);
UserRouter.get("/:userId", UserController.getUserByID);
UserRouter.put("/changePassword", authUser, UserController.changePassword);

export default UserRouter;
