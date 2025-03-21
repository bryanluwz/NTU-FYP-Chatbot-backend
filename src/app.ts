import express from "express";
import ChatRouter from "./routes/chatRoutes";
import cors from "cors";
import DashboardRouter from "./routes/dashboardRoutes";
import AuthRouter from "./routes/authRoutes";
import UserRouter from "./routes/userRoute";
import PersonaRouter from "./routes/personaRoutes";
import path from "path";
import fs from "fs";
import mime from "mime-types";

require("dotenv").config();

// Make directories for storing files
const directories = [
  path.resolve(process.cwd(), process.env.AVATARS_STORAGE || "/avatars"),
  path.resolve(process.cwd(), process.env.DOCUMENTS_STORAGE || "documents"),
  path.resolve(process.cwd(), process.env.UPLOADS_STORAGE || "/uploads"),
  path.resolve(process.cwd(), process.env.TTS_STORAGE || "/tts"),
];

// Check if test.db exists as a file
const databaseFile = path.resolve(
  process.cwd(),
  process.env.DATABASE_STORAGE || "database.db"
);

if (fs.existsSync(databaseFile)) {
  console.log("Database file already exists.");
} else {
  fs.writeFileSync(databaseFile, ""); // Create an empty file
  console.log(`Created database file: ${databaseFile}`);
}

// Check if directories exist and create them if they don't
if (directories.every((dir) => fs.existsSync(dir))) {
  console.log("All storage directories already exist.");
} else {
  directories.forEach((dir) => {
    if (dir) {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`Created directory: ${dir}`);
      }
    }
  });
}

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

app.use(
  "/tts",
  express.static(path.resolve(process.cwd(), process.env.TTS_STORAGE || "/tts"))
);

app.use("/uploads", (req, res, next) => {
  const uploadDirectory = path.resolve(
    process.cwd(),
    process.env.UPLOADS_STORAGE || "uploads"
  );

  const decodedPath = decodeURIComponent(req.path);
  const filePath = path.join(uploadDirectory, decodedPath);

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      return res.status(404).json({ error: "File not found" });
    }

    const mimeType = mime.lookup(filePath);

    if (mimeType && mimeType.startsWith("image/")) {
      // Serve the image file
      return express.static(uploadDirectory)(req, res, next);
    } else {
      // Return a dummy file object with only the file name
      const fileName = path.basename(filePath);
      const dummyFile = Buffer.from(""); // Empty buffer for dummy content
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${fileName}"`
      );
      res.setHeader("Content-Type", "application/octet-stream");
      return res.send(dummyFile);
    }
  });
});

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
let feBuildPath = path.join(
  __dirname,
  process.env.FE_BUILD_PATH || "./frontend/build"
);

if (!fs.existsSync(feBuildPath)) {
  console.log(
    "Frontend build path does not exist. Using development build path or whatever"
  );
  feBuildPath = path.join(
    __dirname,
    process.env.FE_BUILD_PATH_DEV || "./frontend/build"
  );
}

app.use(express.static(path.join(feBuildPath)));

app.get("/", (req, res) => {
  console.log("Serving frontend...");
  res.sendFile(path.join(feBuildPath, "index.html"));
});

export default app;
