"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
const AuthRouter = express_1.default.Router();
// Register a new user
AuthRouter.post("/auth/register", authController_1.registerUser);
AuthRouter.post("/auth/login", authController_1.loginUser);
AuthRouter.post("/auth/user", authController_1.authenticateToken, authController_1.getUser);
exports.default = AuthRouter;
