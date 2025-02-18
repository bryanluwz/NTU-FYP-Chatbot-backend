"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dashboardController_1 = require("../controllers/dashboardController");
const authController_1 = require("../controllers/authController");
const DashboardRouter = express_1.default.Router();
// Define routes related to chat (dont ask why the user info is here)
DashboardRouter.get("/dashboard/admin/users", authController_1.authenticateToken, dashboardController_1.getUserList);
exports.default = DashboardRouter;
