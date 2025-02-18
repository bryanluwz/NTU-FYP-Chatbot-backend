"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Persona = void 0;
const sequelize_1 = __importDefault(require("../database/sequelize"));
const { DataTypes } = require("sequelize");
const Persona = sequelize_1.default.define("Persona", {
    personaId: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4, // Automatically generate UUIDs
    },
    personaName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    personaDescription: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    personaAvatar: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: "avatars/default_persona.png", // Default avatar
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    documentSrc: {
        type: DataTypes.STRING,
        allowNull: true,
    },
}, {
    timestamps: true,
});
exports.Persona = Persona;
