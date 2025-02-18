"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Chat = void 0;
const sequelize_1 = __importDefault(require("../database/sequelize"));
const { DataTypes } = require("sequelize");
const Chat = sequelize_1.default.define("Chat", {
    chatId: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
    },
    chatName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    messages: {
        type: DataTypes.TEXT, // Store messages as JSON string
        allowNull: false,
        defaultValue: "[]",
        get() {
            const rawValue = this.getDataValue("messages");
            return JSON.parse(rawValue);
        },
        set(value) {
            this.setDataValue("messages", JSON.stringify(value));
        },
    },
    personaId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
}, {
    timestamps: true, // Adds createdAt and updatedAt fields
});
exports.Chat = Chat;
