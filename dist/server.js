"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const init_users_1 = __importStar(require("./seeders/init_users"));
const models_1 = require("./models");
const sequelize_1 = __importDefault(require("./database/sequelize"));
require("dotenv").config();
const PORT = process.env.PORT || 3000;
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"; // is this a good practice idk
const https = require("https");
const fs = require("fs");
const options = {
    key: fs.readFileSync("server.key"),
    cert: fs.readFileSync("server.cert"),
};
// Parse command-line arguments
const args = process.argv.slice(1);
const isDebug = args.includes("--debug");
// Start the server after syncing the database
const initMockData = () => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, init_users_1.default)();
});
sequelize_1.default
    .sync({ force: false }) // Set to true to drop and recreate tables on every run
    .then(() => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Database synced.");
    // Check if the database is empty before inserting mock data
    const userCount = yield models_1.User.count();
    if (userCount === 0 && isDebug) {
        console.log("No users found, inserting mock data...");
        yield initMockData();
    }
    else if (userCount == 0) {
        console.log("No users found... Making a new admin user, with the following credentials:\nUsername: admin\nPassword: admin\nPlease change this password immediately after logging in.");
        yield (0, init_users_1.initializeAdmin)();
    }
    // Create app that was imported
    https.createServer(options, app_1.default).listen(PORT, "0.0.0.0", () => {
        console.log(`Server running on https://localhost:${PORT}`);
    });
}))
    .catch((err) => {
    console.error("Unable to connect to the database:", err);
});
