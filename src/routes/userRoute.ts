import express from "express";
import {
  createUser,
  deleteUser,
  getUserInfo,
  updateUserSettingsConfig,
  udpateUserPassword,
  updateUser,
  uploadUserMiddleware,
} from "../controllers/userController";
import { authenticateToken } from "../controllers/authController";
import { get } from "http";

const UserRouter = express.Router();

UserRouter.post("/user/create", authenticateToken, createUser);
UserRouter.post(
  "/user/update",
  authenticateToken,
  uploadUserMiddleware,
  updateUser
);
UserRouter.post("/user/delete", authenticateToken, deleteUser);
UserRouter.post("/user/updatepw", authenticateToken, udpateUserPassword);

UserRouter.get("/user/info", authenticateToken, getUserInfo);

UserRouter.post("/user/settings", authenticateToken, updateUserSettingsConfig);

export default UserRouter;
