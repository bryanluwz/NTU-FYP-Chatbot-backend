import express from "express";
import {
  getUser,
  loginUser,
  registerUser,
} from "../controllers/authController";

const authMiddleware = require("../middleware/auth");

const AuthRouter = express.Router();

// Register a new user
AuthRouter.post("/register", registerUser);
AuthRouter.post("/login", loginUser);
AuthRouter.get("/user", authMiddleware, getUser);

export default AuthRouter;
