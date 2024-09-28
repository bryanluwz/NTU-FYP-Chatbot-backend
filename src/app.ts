import express from "express";
import ChatRouter from "./routes/chatRoutes";
import cors from "cors";
import DashboardRouter from "./routes/dashboardRoutes";
import AuthRouter from "./routes/authRoutes";

const { sequelize, User, Persona, Chat } = require("./models"); // Import models

const app = express();

// Enable CORS for all routes
app.use(cors());

// Serve static assets
app.use("/assets", express.static("./assets"));

// Middleware to parse JSON
app.use(express.json());

// Connection test from FE
app.get("/api/hello", (req, res) => {
  res.json({
    message: "Nihao from the other sideeeeeeeeeee!",
    requestBody: { req },
  });
});

// Use different routes for different APIs
app.use("/api", ChatRouter);
app.use("/api", DashboardRouter);
app.use("/api", AuthRouter);

export default app;
