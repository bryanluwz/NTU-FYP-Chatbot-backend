import sequelize from "../database/sequelize";
const { DataTypes } = require("sequelize");
import { Persona } from "./Persona";

const Document = sequelize.define("Document", {
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

// Define Associations
Persona.hasMany(Document, { foreignKey: "personaId" });

export { Document };
