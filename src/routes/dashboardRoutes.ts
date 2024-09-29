import express from "express";
import {
  createUser,
  deleteUser,
  getAvailableChats,
  getUserList,
  updateUser,
} from "../controllers/dashboardController";
import { authenticateToken } from "../controllers/authController";

const DashboardRouter = express.Router();

// Define routes related to chat (dont ask why the user info is here)
DashboardRouter.get(
  "/dashboard/available",
  authenticateToken,
  getAvailableChats
);
DashboardRouter.get("/dashboard/admin/users", authenticateToken, getUserList);
DashboardRouter.post("/dashboard/admin/update", authenticateToken, updateUser);
DashboardRouter.post("/dashboard/admin/delete", authenticateToken, deleteUser);
DashboardRouter.post("/dashboard/admin/create", authenticateToken, createUser);

export default DashboardRouter;
