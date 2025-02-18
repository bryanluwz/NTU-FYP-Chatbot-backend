"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Document = void 0;
const sequelize_1 = __importDefault(require("../database/sequelize"));
const { DataTypes } = require("sequelize");
const Persona_1 = require("./Persona");
const Document = sequelize_1.default.define("Document", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    filePath: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    documentType: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    title: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    embeddingIndex: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
});
exports.Document = Document;
// Define Associations
Persona_1.Persona.hasMany(Document, { foreignKey: "personaId" });
