import express from "express";
import {
  createUser,
  deleteUser,
  getUserInfo,
  udpateUserPassword,
  updateUser,
  uploadUserMiddleware,
} from "../controllers/userController";
import { authenticateToken } from "../controllers/authController";

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

export default UserRouter;
