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
exports.authenticateToken = exports.getUser = exports.loginUser = exports.registerUser = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../models/User");
const enums_1 = require("../typings/enums");
const fs_1 = __importDefault(require("fs"));
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, email, password } = req.body;
    // Basic validation
    if (!username || !email || !password) {
        return res.status(400).json({ error: "Please enter all fields." });
    }
    try {
        // Check if user exists
        let user = yield User_1.User.findOne({ where: { email } });
        if (user)
            return res.status(400).json({ error: "User already exists." });
        // Hash password
        const salt = yield bcryptjs_1.default.genSalt(10);
        const hashedPassword = yield bcryptjs_1.default.hash(password, salt);
        // Create new user
        user = yield User_1.User.create({
            username,
            email,
            password: hashedPassword,
        });
        // Create and return JWT
        const payload = { userId: user.id };
        let jwtSecret = undefined;
        // Check if jwt_secret is defined in run/secrets/jwt_secret
        if (fs_1.default.existsSync("/run/secrets/jwt_secret")) {
            jwtSecret = fs_1.default.readFileSync("/run/secrets/jwt_secret", "utf8");
        }
        else {
            if (!process.env.JWT_SECRET) {
                throw new Error("JWT_SECRET is not defined in environment variables.");
            }
            jwtSecret = process.env.JWT_SECRET;
        }
        const token = jsonwebtoken_1.default.sign(payload, jwtSecret, {
            expiresIn: process.env.JWT_EXPIRES_IN,
        });
        res.json({
            status: {
                code: 201,
                message: "User registered successfully.",
            },
            data: {
                token: token,
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    avatar: user.avatar || "",
                    role: user.role || enums_1.UserRoleEnum.User,
                },
            },
        });
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send({ error: "Server error." });
    }
});
exports.registerUser = registerUser;
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    // Basic validation
    if (!email || !password) {
        return res.status(400).json({ error: "Please enter all fields." });
    }
    try {
        // Check for user
        let user = yield User_1.User.findOne({ where: { email } });
        if (!user) {
            user = yield User_1.User.findOne({ where: { username: email } });
        }
        if (!user)
            return res.status(400).json({ error: "Invalid credentials." });
        // Validate password
        const isMatch = yield bcryptjs_1.default.compare(password, user.password);
        if (!isMatch)
            return res.status(400).json({ error: "Invalid credentials." });
        // Create and return JWT
        const payload = { userId: user.id };
        let jwtSecret = undefined;
        // Check if jwt_secret is defined in run/secrets/jwt_secret
        if (fs_1.default.existsSync("/run/secrets/jwt_secret")) {
            jwtSecret = fs_1.default.readFileSync("/run/secrets/jwt_secret", "utf8");
        }
        else {
            if (!process.env.JWT_SECRET) {
                throw new Error("JWT_SECRET is not defined in environment variables.");
            }
            jwtSecret = process.env.JWT_SECRET;
        }
        const token = jsonwebtoken_1.default.sign(payload, jwtSecret, {
            expiresIn: process.env.JWT_EXPIRES_IN,
        });
        res.json({
            status: {
                code: 200,
                message: "User logged in successfully.",
            },
            data: {
                token: token,
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    avatar: user.avatar || "",
                    role: user.role || enums_1.UserRoleEnum.User,
                },
            },
        });
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send({ error: "Server error." });
    }
});
exports.loginUser = loginUser;
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req;
        const user = yield User_1.User.findByPk(userId, {
            attributes: ["id", "username", "email", "createdAt", "updatedAt"],
        });
        if (!user)
            return res.status(404).json({ error: "User not found." });
        res.json({
            status: {
                code: 200,
                message: "User found successfully.",
            },
            data: {
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    role: user.role || enums_1.UserRoleEnum.User,
                    avatar: user.avatar || "",
                },
            },
        });
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send({ error: "Server error." });
    }
});
exports.getUser = getUser;
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Get token from "Bearer TOKEN" format
    if (!token)
        return res.status(401).json({ error: "Access denied. No token provided." });
    let jwtSecret = undefined;
    // Check if jwt_secret is defined in run/secrets/jwt_secret
    if (fs_1.default.existsSync("/run/secrets/jwt_secret")) {
        jwtSecret = fs_1.default.readFileSync("/run/secrets/jwt_secret", "utf8");
    }
    else {
        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET is not defined in environment variables.");
        }
        jwtSecret = process.env.JWT_SECRET;
    }
    jsonwebtoken_1.default.verify(token, jwtSecret, (err, user) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            console.error(err.message);
            return res.status(403).json({ error: "Invalid token." });
        }
        // Attach user details to the request object
        req.userId = user.userId; // Attach fetched user details
        next(); // Proceed to the next middleware or route handler
    }));
};
exports.authenticateToken = authenticateToken;
