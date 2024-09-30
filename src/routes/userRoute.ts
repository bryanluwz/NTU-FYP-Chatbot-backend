import express from "express";
import {
  createUser,
  deleteUser,
  udpateUserPassword,
  updateUser,
} from "../controllers/userController";
import { authenticateToken } from "../controllers/authController";

const UserRouter = express.Router();

UserRouter.post("/user/create", authenticateToken, createUser);
UserRouter.post("/user/update", authenticateToken, updateUser);
UserRouter.post("/user/delete", authenticateToken, deleteUser);
UserRouter.post("/user/updatepw", authenticateToken, udpateUserPassword);

export default UserRouter;
