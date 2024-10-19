import express from "express";
import { getUserList } from "../controllers/dashboardController";
import { authenticateToken } from "../controllers/authController";

const DashboardRouter = express.Router();

// Define routes related to chat (dont ask why the user info is here)
DashboardRouter.get("/dashboard/admin/users", authenticateToken, getUserList);

export default DashboardRouter;
