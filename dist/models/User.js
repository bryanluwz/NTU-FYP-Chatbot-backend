"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const sequelize_1 = __importDefault(require("../database/sequelize"));
const enums_1 = require("../typings/enums");
const { DataTypes } = require("sequelize");
const User = sequelize_1.default.define("User", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            len: [3, 30],
        },
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: { msg: "Must be a valid email address" },
        },
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [6],
        },
    },
    role: {
        type: DataTypes.ENUM(Object.values(enums_1.UserRoleEnum)),
        defaultValue: "user",
    },
    avatar: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: "",
    },
    settings: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: {},
    },
}, {
    timestamps: true,
});
exports.User = User;
