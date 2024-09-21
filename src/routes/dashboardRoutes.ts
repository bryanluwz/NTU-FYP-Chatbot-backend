import express from "express";
import { getAvailableChats } from "../controllers/dashboardController";

const DashboardRouter = express.Router();

// Define routes related to chat (dont ask why the user info is here)
DashboardRouter.get("/dashboard/available", getAvailableChats);

export default DashboardRouter;
