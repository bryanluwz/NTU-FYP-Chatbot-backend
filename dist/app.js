"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const chatRoutes_1 = __importDefault(require("./routes/chatRoutes"));
const cors_1 = __importDefault(require("cors"));
const dashboardRoutes_1 = __importDefault(require("./routes/dashboardRoutes"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const userRoute_1 = __importDefault(require("./routes/userRoute"));
const personaRoutes_1 = __importDefault(require("./routes/personaRoutes"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const mime_types_1 = __importDefault(require("mime-types"));
require("dotenv").config();
// Make directories for storing files
const directories = [
    path_1.default.resolve(process.cwd(), process.env.AVATARS_STORAGE || "/avatars"),
    path_1.default.resolve(process.cwd(), process.env.DOCUMENTS_STORAGE || "documents"),
    path_1.default.resolve(process.cwd(), process.env.UPLOADS_STORAGE || "/uploads"),
    path_1.default.resolve(process.cwd(), process.env.TTS_STORAGE || "/tts"),
];
// Check if test.db exists as a file
const databaseFile = path_1.default.resolve(process.cwd(), process.env.DATABASE_STORAGE || "database.db");
if (fs_1.default.existsSync(databaseFile)) {
    console.log("Database file already exists.");
}
else {
    fs_1.default.writeFileSync(databaseFile, ""); // Create an empty file
    console.log(`Created database file: ${databaseFile}`);
}
// Check if directories exist and create them if they don't
if (directories.every((dir) => fs_1.default.existsSync(dir))) {
    console.log("All storage directories already exist.");
}
else {
    directories.forEach((dir) => {
        if (dir) {
            if (!fs_1.default.existsSync(dir)) {
                fs_1.default.mkdirSync(dir, { recursive: true });
                console.log(`Created directory: ${dir}`);
            }
        }
    });
}
const app = (0, express_1.default)();
// Enable CORS for all routes
app.use((0, cors_1.default)());
// Serve static assets
app.use("/avatars", express_1.default.static(path_1.default.resolve(process.cwd(), process.env.AVATARS_STORAGE || "/avatars")));
app.use("/tts", express_1.default.static(path_1.default.resolve(process.cwd(), process.env.TTS_STORAGE || "/tts")));
app.use("/uploads", (req, res, next) => {
    const uploadDirectory = path_1.default.resolve(process.cwd(), process.env.UPLOADS_STORAGE || "uploads");
    const decodedPath = decodeURIComponent(req.path);
    const filePath = path_1.default.join(uploadDirectory, decodedPath);
    fs_1.default.stat(filePath, (err, stats) => {
        if (err || !stats.isFile()) {
            return res.status(404).json({ error: "File not found" });
        }
        const mimeType = mime_types_1.default.lookup(filePath);
        if (mimeType && mimeType.startsWith("image/")) {
            // Serve the image file
            return express_1.default.static(uploadDirectory)(req, res, next);
        }
        else {
            // Return a dummy file object with only the file name
            const fileName = path_1.default.basename(filePath);
            const dummyFile = Buffer.from(""); // Empty buffer for dummy content
            res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
            res.setHeader("Content-Type", "application/octet-stream");
            return res.send(dummyFile);
        }
    });
});
// Middleware to parse JSON
app.use(express_1.default.json());
// Connection test from FE
app.get("/api/hello", (req, res) => {
    res.json({
        message: "Nihao from the other sideeeeeeeeeee!",
    });
});
// Use different routes for different APIs
app.use("/api", chatRoutes_1.default);
app.use("/api", dashboardRoutes_1.default);
app.use("/api", authRoutes_1.default);
app.use("/api", userRoute_1.default);
app.use("/api", personaRoutes_1.default);
// Host React frontend
app.use(express_1.default.static(path_1.default.join(__dirname, process.env.FE_BUILD_PATH || "./frontend/build")));
app.get("/", (req, res) => {
    console.log("Serving frontend...");
    res.sendFile(path_1.default.join(__dirname, process.env.FE_BUILD_PATH || "./frontend/build", "index.html"));
});
exports.default = app;
