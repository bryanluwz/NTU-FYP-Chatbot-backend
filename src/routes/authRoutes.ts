import express from "express";
import {
  authenticateToken,
  getUser,
  loginUser,
  registerUser,
} from "../controllers/authController";

const AuthRouter = express.Router();

// Register a new user
AuthRouter.post("/auth/register", registerUser);
AuthRouter.post("/auth/login", loginUser);
AuthRouter.post("/auth/user", authenticateToken, getUser);

export default AuthRouter;
