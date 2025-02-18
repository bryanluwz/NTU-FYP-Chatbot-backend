"use strict";
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
exports.uploadUserMiddleware = exports.updateUserSettingsConfig = exports.getUserInfo = exports.udpateUserPassword = exports.createUser = exports.deleteUser = exports.updateUser = void 0;
const multer_1 = __importDefault(require("multer"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const uuid_1 = require("uuid");
const models_1 = require("../models");
const enums_1 = require("../typings/enums");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
// Set up multer for file handling
const upload = (0, multer_1.default)({
    limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
});
const databaseAvatarStoragePath = path_1.default.resolve(process.cwd(), process.env.AVATARS_STORAGE || "avatars");
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // This userId is the admin's (or requester) userId
    const userId = req.userId;
    const user = yield models_1.User.findByPk(userId);
    if (!user || (user.role !== enums_1.UserRoleEnum.Admin && user.id !== userId)) {
        return res.status(404).json({ error: "Unauthorized" });
    }
    const avatar = req.file;
    const userInfo = JSON.parse(req.body.userInfo);
    try {
        // Upload avatar here
        if (avatar) {
            // Generate a unique filename for the avatar
            const avatarFilename = `avatar_${(0, uuid_1.v4)()}${path_1.default.extname(avatar.originalname)}`;
            const avatarPath = path_1.default.join(databaseAvatarStoragePath, avatarFilename); // Adjust path as needed
            // Remove original avatar file
            if (user.avatar) {
                const avatarPath = path_1.default.join(databaseAvatarStoragePath, user.avatar);
                if (fs_1.default.existsSync(avatarPath)) {
                    fs_1.default.unlinkSync(avatarPath);
                }
            }
            // Upload avatar: save the file locally to the 'uploads' folder
            fs_1.default.writeFileSync(avatarPath, avatar.buffer);
            // Save the path (or URL if hosted) to userInfo
            userInfo.avatar = `${avatarFilename}`; // Adjust path for how you'll serve the file
        }
        yield models_1.User.update(userInfo, { where: { id: userInfo.id } });
        return res.json({
            status: {
                code: 200,
                message: "OK",
            },
            data: {},
        });
    }
    catch (err) {
        console.error(err.message);
        return res.status(500).json({ error: "Failed to update user" });
    }
});
exports.updateUser = updateUser;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    const user = yield models_1.User.findByPk(userId);
    const userInfo = req.body.userInfo;
    if (!user || user.role !== "admin" || userInfo.id === userId) {
        // Check admin or delete self
        return res.status(404).json({ error: "Unauthorized" });
    }
    try {
        yield models_1.User.destroy({ where: { id: userInfo.id } });
        return res.json({
            status: {
                code: 200,
                message: "OK",
            },
            data: {},
        });
    }
    catch (err) {
        console.error(err.message);
        return res.status(500).json({ error: "Failed to create user" });
    }
});
exports.deleteUser = deleteUser;
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    const user = yield models_1.User.findByPk(userId);
    if (!user || user.role !== "admin") {
        return res.status(404).json({ error: "Unauthorized" });
    }
    const userInfo = req.body.user;
    try {
        yield models_1.User.create(userInfo);
        return res.json({
            status: {
                code: 200,
                message: "OK",
            },
            data: {},
        });
    }
    catch (err) {
        console.error(err.message);
        return res.status(500).json({ error: "Failed to create user" });
    }
});
exports.createUser = createUser;
const udpateUserPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    const user = (yield models_1.User.findByPk(userId));
    if (!user || user.id !== userId) {
        return res.status(404).json({ error: "Unauthorized" });
    }
    const oldPassword = req.body.oldPassword;
    const newPassword = req.body.newPassword;
    try {
        // check if old password is correct
        const user = yield models_1.User.findByPk(userId);
        if (!user || !(yield bcryptjs_1.default.compare(oldPassword, user.password))) {
            return res.status(404).json({ error: "Unauthorized" });
        }
        // Hash password
        const salt = yield bcryptjs_1.default.genSalt(10);
        const hashedPassword = yield bcryptjs_1.default.hash(newPassword, salt);
        yield models_1.User.update({ password: hashedPassword }, { where: { id: userId } });
        return res.json({
            status: {
                code: 200,
                message: "OK",
            },
            data: {},
        });
    }
    catch (err) {
        console.error(err.message);
        return res.status(500).json({ error: "Failed to update user password" });
    }
});
exports.udpateUserPassword = udpateUserPassword;
const getUserInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    try {
        const user = (yield models_1.User.findByPk(userId));
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        const avatarPath = path_1.default.join("/avatars", user.avatar);
        return res.json({
            status: {
                code: 200,
                message: "OK",
            },
            data: {
                userInfo: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    role: user.role,
                    avatar: avatarPath,
                },
            },
        });
    }
    catch (err) {
        console.error(err.message);
        return res.status(500).json({ error: "Failed to retrieve user info" });
    }
});
exports.getUserInfo = getUserInfo;
const updateUserSettingsConfig = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const action = req.body.action;
    switch (action) {
        case "get":
            return getUserSettings(req, res);
        case "update":
            return updateUserSettings(req, res);
        default:
            return res.status(400).json({ error: "Invalid action" });
    }
});
exports.updateUserSettingsConfig = updateUserSettingsConfig;
const getUserSettings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = req.userId;
    try {
        const user = (yield models_1.User.findByPk(userId));
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        return res.json({
            status: {
                code: 200,
                message: "OK",
            },
            data: {
                settings: (_a = user.settings) !== null && _a !== void 0 ? _a : {},
            },
        });
    }
    catch (err) {
        console.error(err.message);
        return res.status(500).json({ error: "Failed to retrieve user settings" });
    }
});
const updateUserSettings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    const user = (yield models_1.User.findByPk(userId));
    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }
    const originalSettings = user.settings;
    const settings = req.body.userSettings;
    try {
        const updatedSettings = Object.assign(Object.assign({}, originalSettings), settings);
        yield models_1.User.update({ settings: updatedSettings }, { where: { id: userId } });
        return res.json({
            status: {
                code: 200,
                message: "OK",
            },
            data: {},
        });
    }
    catch (err) {
        console.error(err.message);
        return res.status(500).json({ error: "Failed to update user settings" });
    }
});
exports.uploadUserMiddleware = upload.single("avatar"); // 'avatar' is the field name for the image
