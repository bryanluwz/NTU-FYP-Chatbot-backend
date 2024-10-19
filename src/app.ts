import express from "express";
import ChatRouter from "./routes/chatRoutes";
import cors from "cors";
import DashboardRouter from "./routes/dashboardRoutes";
import AuthRouter from "./routes/authRoutes";
import UserRouter from "./routes/userRoute";
import path from "path";
import PersonaRouter from "./routes/personaRoutes";

require("dotenv").config();

const app = express();

// Enable CORS for all routes
app.use(cors());

// Serve static assets
app.use(
  "/avatars",
  express.static(
    path.resolve(process.cwd(), process.env.AVATARS_STORAGE || "/avatars")
  )
);

// Middleware to parse JSON
app.use(express.json());

// Connection test from FE
app.get("/api/hello", (req, res) => {
  res.json({
    message: "Nihao from the other sideeeeeeeeeee!",
  });
});

// Use different routes for different APIs
app.use("/api", ChatRouter);
app.use("/api", DashboardRouter);
app.use("/api", AuthRouter);
app.use("/api", UserRouter);
app.use("/api", PersonaRouter);

// Host React frontend
app.use(
  express.static(
    path.join(__dirname, process.env.FE_BUILD_PATH || "./frontend/build")
  )
);

app.get("/", (req, res) => {
  console.log("Serving frontend...");
  res.sendFile(
    path.join(
      __dirname,
      process.env.FE_BUILD_PATH || "./frontend/build",
      "index.html"
    )
  );
});

export default app;
