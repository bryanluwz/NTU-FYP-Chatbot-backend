"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const authController_1 = require("../controllers/authController");
const UserRouter = express_1.default.Router();
UserRouter.post("/user/create", authController_1.authenticateToken, userController_1.createUser);
UserRouter.post("/user/update", authController_1.authenticateToken, userController_1.uploadUserMiddleware, userController_1.updateUser);
UserRouter.post("/user/delete", authController_1.authenticateToken, userController_1.deleteUser);
UserRouter.post("/user/updatepw", authController_1.authenticateToken, userController_1.udpateUserPassword);
UserRouter.get("/user/info", authController_1.authenticateToken, userController_1.getUserInfo);
UserRouter.post("/user/settings", authController_1.authenticateToken, userController_1.updateUserSettingsConfig);
exports.default = UserRouter;
